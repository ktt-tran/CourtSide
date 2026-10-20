# CourtSide

A local pickup-game feed: host a game, see what's happening nearby, watch the score live. Built from
the feasibility/architecture doc from our chat — see that for the reasoning behind every choice below;
this README is just the "how do I run it" version.

## Stack

Expo (React Native, SDK 57, file-based routing) + Supabase (Postgres, PostGIS, Auth, Realtime).
Guests can browse; an account is required to host, RSVP, or see who's attending — enforced by the
database itself (Row Level Security + column-level grants), not just hidden in the UI.

## Set up

**1. Create a Supabase project** at [supabase.com](https://supabase.com) (the free tier is enough to
build against).

**2. Run the migration.** Open the SQL Editor in your project and run everything in
`supabase/migrations/20260928000000_init.sql`. It creates the tables, the `nearby_events()` feed
function, the RLS policies, and the triggers — reasoning for each is in the comments and in §6.1 of
the plan doc. (If you'd rather use the Supabase CLI: `supabase link`, then `supabase db push`.)

**3. Get your API keys.** Project → Connect (or Settings → API Keys). Copy `.env.example` to `.env`
and fill in your project URL and **publishable** key:

```bash
cp .env.example .env
```

Never put the `service_role` / secret key in this file — it bypasses every RLS policy above.

**4. Install and run:**

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator. Location permission is required —
the feed and hosting a game both need it.

## What's here vs. what's next

Working: sign up / sign in, guest browsing, hosting a game (pinned to your current location), the
proximity feed with a sport filter, RSVP, the roster/attendee split, starting a live game with a
score, and realtime score updates on both the feed and the detail screen.

Deliberately not built yet, per the roadmap in the plan doc: address search when hosting (events are
pinned to wherever you're standing when you tap "Host"), profile photos, recurring events, the
weighted feed ranking beyond distance/time, and the web guest view. `src/lib/types.ts` and the
migration are already shaped to support all of these without a redesign.

## Project layout

```
src/
  app/            expo-router screens (the folder structure IS the navigation)
    (tabs)/       Games (feed), Host (create), Profile
    event/[id]/   game detail
    sign-in.tsx   modal, shared by sign in and sign up
  components/     presentational pieces (FeedCard, LiveScore, Chips, ...)
  lib/            everything that isn't a screen — Supabase client, auth context,
                  location hook, realtime subscriptions, formatting, theme
supabase/
  migrations/     the schema — this IS the backend; there's no separate API server to write
```

## A note on the schema

The migration was tested against a real Postgres + PostGIS + PostgREST stack (not just read over) —
every RLS policy, the signup trigger, the denormalized-count triggers, and the exact embed/RPC calls
this app makes were run and checked before this was handed off. If you change the schema, re-check
the guest-vs-account boundary in particular: it works because `attendance` and `event_players` have
no `anon` grant at all, not because of a rule that says "block guests".
