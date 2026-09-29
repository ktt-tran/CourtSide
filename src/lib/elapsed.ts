import { useEffect, useState } from 'react';

// "22:14" since startedAt, ticking locally once a second. Only startedAt is synced from the server;
// every phone keeps its own clock, so a live game costs the backend nothing per second.
export function useElapsed(startedAt: string | null): string | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startedAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  if (!startedAt) return null;
  const seconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
