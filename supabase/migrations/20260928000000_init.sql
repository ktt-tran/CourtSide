-- Pickup Ball: initial schema.
--
-- Run it in the Supabase SQL editor, or keep it under supabase/migrations/ and use `supabase db push`.
--
-- Two things changed on Supabase recently, and both shape this file:
--   1. New projects no longer expose new public tables and functions to the Data API automatically,
--      so every table and function below gets explicit GRANTs. GRANTs decide which operations a role
--      may attempt; RLS policies decide which rows it can touch. You need both.
--   2. PostGIS lives in the `extensions` schema, so PostGIS names are schema-qualified.

create extension if not exists postgis with schema extensions;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Public-safe profile. auth.users (managed by Supabase) holds the email and password hash;
-- this table holds only what is safe to show to anyone.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (char_length(username) between 2 and 30),
  photo_url text,
  preferred_sports text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  category text not null,
  title text not null check (char_length(title) between 1 and 100),
  description text check (char_length(description) <= 1000),
  location_text text not null check (char_length(location_text) between 1 and 120),
  location extensions.geography(point, 4326) not null,
  start_time timestamptz not null,
  status text not null default 'upcoming'
    check (status in ('upcoming', 'live', 'completed', 'cancelled')),
  max_players int check (max_players is null or max_players > 0),
  attendee_count int not null default 0 check (attendee_count >= 0),
  player_count int not null default 0 check (player_count >= 0),
  created_at timestamptz not null default now()
);

create index events_location_idx on public.events using gist (location);
create index events_start_time_idx on public.events (start_time);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'going' check (status in ('going', 'interested')),
  checked_in boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index attendance_user_idx on public.attendance (user_id);

create table public.event_players (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  team text,
  unique (event_id, user_id)
);

create table public.live_state (
  event_id uuid primary key references public.events (id) on delete cascade,
  is_live boolean not null default false,
  started_at timestamptz,
  score jsonb not null default '{}'::jsonb,
  period int not null default 1
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
-- These are SECURITY DEFINER so they can write rows the calling user has no direct right to write
-- (for example, the denormalized counts on events). search_path is pinned so they can't be hijacked.

-- Every new auth user gets a profile. The username comes from signup metadata; if it's missing,
-- too short, or taken, fall back to something valid instead of failing the signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base text := left(
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    30
  );
begin
  if char_length(base) < 2 then
    base := 'player';
  end if;

  begin
    insert into public.profiles (id, username) values (new.id, base);
  exception when unique_violation then
    insert into public.profiles (id, username)
    values (new.id, left(base, 25) || '_' || substr(new.id::text, 1, 4));
  end;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Every new event gets a live_state row (so hosts only ever UPDATE it),
-- and the host counts as going. Remove the second insert if you'd rather hosts RSVP themselves.
create or replace function public.handle_new_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.live_state (event_id) values (new.id);
  insert into public.attendance (event_id, user_id) values (new.id, new.host_id);
  return null;
end;
$$;

create trigger on_event_created
after insert on public.events
for each row execute function public.handle_new_event();

-- Keep events.attendee_count equal to the number of 'going' rows without a COUNT(*) on every feed load.
-- Increment/decrement (rather than recount) stays correct when two people RSVP at the same moment.
create or replace function public.sync_attendee_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' and new.status = 'going' then
    update public.events set attendee_count = attendee_count + 1 where id = new.event_id;
  elsif tg_op = 'DELETE' and old.status = 'going' then
    update public.events set attendee_count = attendee_count - 1 where id = old.event_id;
  elsif tg_op = 'UPDATE' then
    if old.status = 'going' and new.status <> 'going' then
      update public.events set attendee_count = attendee_count - 1 where id = new.event_id;
    elsif old.status <> 'going' and new.status = 'going' then
      update public.events set attendee_count = attendee_count + 1 where id = new.event_id;
    end if;
  end if;
  return null;
end;
$$;

create trigger trg_attendance_count
after insert or update of status or delete on public.attendance
for each row execute function public.sync_attendee_count();

create or replace function public.sync_player_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.events set player_count = player_count + 1 where id = new.event_id;
  elsif tg_op = 'DELETE' then
    update public.events set player_count = player_count - 1 where id = old.event_id;
  end if;
  return null;
end;
$$;

create trigger trg_player_count
after insert or delete on public.event_players
for each row execute function public.sync_player_count();

-- Trigger functions should never be callable through the API.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.handle_new_event() from public, anon, authenticated;
revoke all on function public.sync_attendee_count() from public, anon, authenticated;
revoke all on function public.sync_player_count() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Feed query
-- ---------------------------------------------------------------------------
-- Upcoming and live games within radius_m meters, live games first, then soonest.
-- SECURITY INVOKER (the default), so RLS still applies to whoever calls it.
create or replace function public.nearby_events(
  user_lat double precision,
  user_lng double precision,
  radius_m integer default 24140,
  category_filter text default null
)
returns table (
  id uuid,
  host_id uuid,
  host_username text,
  host_photo_url text,
  category text,
  title text,
  description text,
  location_text text,
  lat double precision,
  lng double precision,
  distance_m double precision,
  start_time timestamptz,
  status text,
  max_players int,
  attendee_count int,
  player_count int,
  is_live boolean,
  live_started_at timestamptz,
  score jsonb
)
language sql
stable
set search_path = ''
as $$
  select
    e.id,
    e.host_id,
    p.username,
    p.photo_url,
    e.category,
    e.title,
    e.description,
    e.location_text,
    extensions.st_y(e.location::extensions.geometry),
    extensions.st_x(e.location::extensions.geometry),
    extensions.st_distance(
      e.location,
      extensions.st_setsrid(extensions.st_makepoint(user_lng, user_lat), 4326)::extensions.geography
    ),
    e.start_time,
    e.status,
    e.max_players,
    e.attendee_count,
    e.player_count,
    coalesce(ls.is_live, false),
    ls.started_at,
    ls.score
  from public.events e
  join public.profiles p on p.id = e.host_id
  left join public.live_state ls on ls.event_id = e.id
  where extensions.st_dwithin(
      e.location,
      extensions.st_setsrid(extensions.st_makepoint(user_lng, user_lat), 4326)::extensions.geography,
      radius_m
    )
    and e.status in ('upcoming', 'live')
    and e.start_time > now() - interval '6 hours'
    and (category_filter is null or e.category = category_filter)
  order by (e.status = 'live') desc, e.start_time asc
  limit 50;
$$;

revoke all on function public.nearby_events(double precision, double precision, integer, text) from public;
grant execute on function public.nearby_events(double precision, double precision, integer, text)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.attendance enable row level security;
alter table public.event_players enable row level security;
alter table public.live_state enable row level security;

-- profiles: anyone can read, you can edit your own.
create policy "Profiles are publicly readable"
  on public.profiles for select to anon, authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- events: public read is what makes the guest feed possible. Only the host can write.
create policy "Events are publicly readable"
  on public.events for select to anon, authenticated
  using (true);

create policy "Hosts can create events"
  on public.events for insert to authenticated
  with check ((select auth.uid()) = host_id);

create policy "Hosts can update their own events"
  on public.events for update to authenticated
  using ((select auth.uid()) = host_id)
  with check ((select auth.uid()) = host_id);

create policy "Hosts can delete their own events"
  on public.events for delete to authenticated
  using ((select auth.uid()) = host_id);

-- attendance and event_players: signed-in users only. Guests are blocked twice over:
-- there is no grant to anon below, and no policy for anon here.
create policy "Signed-in users can view the attendee list"
  on public.attendance for select to authenticated
  using (true);

create policy "Users can RSVP for themselves"
  on public.attendance for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can change their own RSVP"
  on public.attendance for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can cancel their own RSVP"
  on public.attendance for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Signed-in users can view the roster"
  on public.event_players for select to authenticated
  using (true);

create policy "Users can add themselves to the roster"
  on public.event_players for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove themselves from the roster"
  on public.event_players for delete to authenticated
  using ((select auth.uid()) = user_id);

-- live_state: the score and live status are public on purpose (guests can watch a game),
-- but only the host or a rostered player can change them.
create policy "Live state is publicly readable"
  on public.live_state for select to anon, authenticated
  using (true);

create policy "Host or players can update live state"
  on public.live_state for update to authenticated
  using (
    exists (select 1 from public.events e where e.id = live_state.event_id and e.host_id = (select auth.uid()))
    or exists (select 1 from public.event_players ep where ep.event_id = live_state.event_id and ep.user_id = (select auth.uid()))
  )
  with check (
    exists (select 1 from public.events e where e.id = live_state.event_id and e.host_id = (select auth.uid()))
    or exists (select 1 from public.event_players ep where ep.event_id = live_state.event_id and ep.user_id = (select auth.uid()))
  );

-- ---------------------------------------------------------------------------
-- Grants (least privilege; column-level where it protects data integrity)
-- ---------------------------------------------------------------------------

grant select on public.profiles to anon, authenticated;
grant update (username, photo_url, preferred_sports) on public.profiles to authenticated;

-- Hosts can't set the counts, the host_id, or the status at creation time.
grant select on public.events to anon, authenticated;
grant insert (host_id, category, title, description, location_text, location, start_time, max_players)
  on public.events to authenticated;
grant update (category, title, description, location_text, location, start_time, status, max_players)
  on public.events to authenticated;
grant delete on public.events to authenticated;

-- No grant to anon: guests can't read these tables at all.
grant select, delete on public.attendance to authenticated;
grant insert (event_id, user_id, status) on public.attendance to authenticated;
grant update (status) on public.attendance to authenticated;

grant select, delete on public.event_players to authenticated;
grant insert (event_id, user_id, team) on public.event_players to authenticated;

-- Rows are created by the on_event_created trigger, so clients only ever read and update.
grant select on public.live_state to anon, authenticated;
grant update (is_live, started_at, score, period) on public.live_state to authenticated;

-- For server-side code (Edge Functions, scripts) that uses the secret key.
grant all on public.profiles, public.events, public.attendance, public.event_players, public.live_state
  to service_role;

-- ---------------------------------------------------------------------------
-- Realtime: broadcast score and live-status changes to anyone viewing the feed.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.live_state;
