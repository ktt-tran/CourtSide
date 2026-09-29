import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { LiveScore } from '@/components/LiveScore';
import { Meta } from '@/components/Meta';
import { useAuth } from '@/lib/auth';
import { categoryById } from '@/lib/categories';
import { formatWhen } from '@/lib/format';
import { useLiveStateUpdates } from '@/lib/realtime';
import { supabase } from '@/lib/supabase';
import { colors, fontSize, radius } from '@/lib/theme';
import type { Score } from '@/lib/types';

type LiveState = { is_live: boolean; started_at: string | null; score: Score | null };

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  location_text: string;
  start_time: string;
  status: string;
  max_players: number | null;
  attendee_count: number;
  player_count: number;
  host: { username: string } | null;
  // PostgREST returns a one-to-one embed as an object; accept an array too so a schema change can't break us.
  live_state: LiveState | LiveState[] | null;
};

type Attendee = { user_id: string; profile: { username: string } | null };

// The host and live state are public, so a guest can load all of this. The attendee query is the one
// that needs an account: the database refuses it for guests, and the screen never sends it.
const EVENT_SELECT =
  'id, title, description, category, location_text, start_time, status, max_players, attendee_count, player_count, host:profiles!host_id(username), live_state(is_live, started_at, score)';

function liveOf(event: EventRow): LiveState | null {
  const state = event.live_state;
  return Array.isArray(state) ? (state[0] ?? null) : state;
}

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [event, setEvent] = useState<EventRow | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('events').select(EVENT_SELECT).eq('id', id).single();
    if (error) {
      // PGRST116 means "no such row".
      setLoadError(error.code === 'PGRST116' ? "This game isn't available anymore." : error.message);
      setLoaded(true);
      return;
    }
    setEvent(data as unknown as EventRow);

    if (userId) {
      const { data: rows } = await supabase
        .from('attendance')
        .select('user_id, profile:profiles!user_id(username)')
        .eq('event_id', id)
        .order('joined_at');
      setAttendees((rows ?? []) as unknown as Attendee[]);
    } else {
      setAttendees([]);
    }
    setLoaded(true);
  }, [id, userId]);

  useEffect(() => {
    load();
  }, [load]);

  useLiveStateUpdates((row) => {
    if (row.event_id !== id) return;
    setEvent((prev) =>
      prev
        ? { ...prev, live_state: { is_live: row.is_live, started_at: row.started_at, score: row.score } }
        : prev,
    );
  });

  async function toggleRsvp() {
    if (!userId) {
      router.push('/sign-in');
      return;
    }
    setBusy(true);
    setActionError(null);
    const going = attendees.some((a) => a.user_id === userId);
    const { error } = going
      ? await supabase.from('attendance').delete().eq('event_id', id).eq('user_id', userId)
      : await supabase.from('attendance').insert({ event_id: id, user_id: userId });
    if (error) setActionError(error.message);
    await load(); // refresh the list and the counts (a database trigger keeps the counts in sync)
    setBusy(false);
  }

  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }
  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.body}>{loadError}</Text>
      </View>
    );
  }

  const live = liveOf(event);
  const category = categoryById(event.category);
  const hostName = event.host?.username ?? 'Someone';
  const players = event.max_players
    ? `${event.player_count}/${event.max_players}`
    : `${event.player_count}`;
  const going = attendees.some((a) => a.user_id === userId);
  const open = event.status === 'upcoming' || event.status === 'live';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: event.title }} />

      <View style={styles.hostRow}>
        <View style={styles.host}>
          <Avatar name={hostName} />
          <View>
            <Text style={styles.hostName}>{hostName}</Text>
            <Text style={styles.caption}>Hosting</Text>
          </View>
        </View>
        <Ionicons name={category.icon} size={22} color={colors.inkSoft} />
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.facts}>
        <Meta icon="time-outline" text={formatWhen(event.start_time)} />
        <Meta icon="location-outline" text={event.location_text} />
        <Meta icon="people-outline" text={`${event.attendee_count} going \u00B7 ${players} playing`} />
      </View>

      {live?.is_live ? <LiveScore startedAt={live.started_at} score={live.score} /> : null}

      {event.description ? <Text style={styles.description}>{event.description}</Text> : null}

      {open ? (
        <Button
          title={going ? 'Leave game' : 'Join game'}
          variant={going ? 'secondary' : 'primary'}
          busy={busy}
          onPress={toggleRsvp}
        />
      ) : (
        <Text style={styles.body}>This game is over.</Text>
      )}
      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Who&apos;s going</Text>
        {userId ? (
          attendees.length > 0 ? (
            attendees.map((a) => (
              <View key={a.user_id} style={styles.person}>
                <Avatar name={a.profile?.username ?? '?'} size={32} />
                <Text style={styles.personName}>{a.profile?.username ?? 'Player'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.body}>No one yet.</Text>
          )
        ) : (
          <View style={styles.locked}>
            <Ionicons name="lock-closed-outline" size={22} color={colors.inkFaint} />
            <Text style={styles.body}>Sign in to see who&apos;s going.</Text>
            <Button title="Sign in" variant="secondary" onPress={() => router.push('/sign-in')} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  hostRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  host: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hostName: { fontSize: 14, fontWeight: '500', color: colors.ink },
  caption: { fontSize: fontSize.small, color: colors.inkFaint },
  title: { fontSize: 22, fontWeight: '500', color: colors.ink },
  facts: { gap: 6 },
  description: { fontSize: fontSize.body, lineHeight: 22, color: colors.inkSoft },
  body: { fontSize: fontSize.body, color: colors.inkSoft, textAlign: 'center', lineHeight: 22 },
  error: { fontSize: fontSize.meta, color: colors.live },
  section: { gap: 10, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: colors.ink },
  person: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  personName: { fontSize: fontSize.body, color: colors.ink },
  locked: {
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
});
