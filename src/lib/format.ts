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
