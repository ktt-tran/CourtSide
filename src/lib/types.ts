// The score is jsonb, so its shape depends on the sport: { skins: 14, shirts: 11 } for a pickup run,
// { home: 2, away: 1 } for soccer. Generate full table types later with `supabase gen types typescript`.
export type Score = Record<string, number>;

// One row from the nearby_events() database function.
export type FeedEvent = {
  id: string;
  host_id: string;
  host_username: string;
  host_photo_url: string | null;
  category: string;
  title: string;
  description: string | null;
  location_text: string;
  lat: number;
  lng: number;
  distance_m: number;
  start_time: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  max_players: number | null;
  attendee_count: number;
  player_count: number;
  is_live: boolean;
  live_started_at: string | null;
  score: Score | null;
};

export type LiveStateRow = {
  event_id: string;
  is_live: boolean;
  started_at: string | null;
  score: Score | null;
};
