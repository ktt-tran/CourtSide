import { useEffect, useId, useRef } from 'react';

import { supabase } from './supabase';
import type { LiveStateRow } from './types';

// Calls onChange whenever any game's live status or score changes (the live_state table is in the
// supabase_realtime publication). Guests get these too, because live_state is publicly readable.
// Scale note: this listens to every game. Once there are many live games, filter to the visible ones.
export function useLiveStateUpdates(onChange: (row: LiveStateRow) => void) {
  const channelName = `live-state-${useId()}`; // unique per hook, so two screens can listen at once
  const latest = useRef(onChange);

  useEffect(() => {
    latest.current = onChange;
  });

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_state' }, (payload) => {
        if (payload.eventType !== 'DELETE') {
          latest.current(payload.new as LiveStateRow);
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);
}
