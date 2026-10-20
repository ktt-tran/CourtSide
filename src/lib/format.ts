import type { Score } from './types';

export function formatDistance(meters: number): string {
  const miles = meters / 1609.344;
  return miles < 0.1 ? 'Nearby' : `${miles.toFixed(1)} mi`;
}

// Short and relative for the feed: "Starts in 45 min", "Started 12 min ago", or "Sat 6:30 PM".
export function formatStart(iso: string, now: number = Date.now()): string {
  const start = new Date(iso);
  const minutes = Math.round((start.getTime() - now) / 60000);
  if (minutes === 0) return 'Starting now';
  if (minutes < 0) {
    const ago = -minutes;
    return ago < 60 ? `Started ${ago} min ago` : `Started ${Math.round(ago / 60)} h ago`;
  }
  if (minutes < 60) return `Starts in ${minutes} min`;
  return start.toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' });
}

// Full date for the detail screen.
export function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatScore(score: Score | null): string {
  const entries = Object.entries(score ?? {});
  if (entries.length === 0) return 'No score yet';
  return entries
    .map(([team, points]) => `${team.charAt(0).toUpperCase()}${team.slice(1)} ${points}`)
    .join(' \u2014 ');
}

// The two halves of a score for the key-paint tile: "14–11", or null before anyone scores.
export function scoreNumbers(score: Score | null): string | null {
  const values = Object.values(score ?? {});
  return values.length === 0 ? null : values.join('–');
}

// "Skins vs Shirts", from the score's team keys.
export function scoreTeams(score: Score | null): string | null {
  const teams = Object.keys(score ?? {});
  if (teams.length === 0) return null;
  return teams.map((t) => `${t.charAt(0).toUpperCase()}${t.slice(1)}`).join(' vs ');
}

// The banner headline, counted honestly: "One soccer game near you", "3 games near you".
export function feedHeadline(count: number, noun: string | null): string {
  const what = noun ? `${noun} game` : 'game';
  if (count === 0) return noun ? `No ${noun} games yet` : 'No games near you yet';
  if (count === 1) return `One ${what} near you`;
  return `${count} ${what}s near you`;
}

// Clock time only, for cards already grouped under "Today": "6:00 PM".
export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export type FeedSection = 'today' | 'week' | 'later';

// Which time section a not-live game belongs to, by the viewer's calendar.
export function sectionOf(iso: string, now: Date = new Date()): FeedSection {
  const start = new Date(iso);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  if (start <= endOfToday) return 'today';
  const endOfWeek = new Date(endOfToday.getTime() + 6 * 86_400_000);
  return start <= endOfWeek ? 'week' : 'later';
}
