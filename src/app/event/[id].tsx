import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { LiveLabel, ScoreTile } from '@/components/LiveScore';
import { Meta } from '@/components/Meta';
import { SportSurface } from '@/components/SportSurface';
import { useAuth } from '@/lib/auth';
import { categoryById } from '@/lib/categories';
import { formatWhen, scoreTeams } from '@/lib/format';
import { useLiveStateUpdates } from '@/lib/realtime';
import { supabase } from '@/lib/supabase';
import { DUSK_INK, surfaceFor } from '@/lib/surfaces';
import { createStyles, radius, type, useIsDark, usePalette } from '@/lib/theme';
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
  const styles = useStyles();
  const c = usePalette();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
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
  const [hero, setHero] = useState({ width: 0, height: 0 });
  const [heroTop, setHeroTop] = useState(0);

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
        <Stack.Screen options={{ headerTintColor: c.ink }} />
        <ActivityIndicator color={c.inkSoft} />
      </View>
    );
  }
  if (!event) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerTintColor: c.ink }} />
        <Text style={styles.heading}>Game not found</Text>
        <Text style={styles.quiet}>{loadError}</Text>
      </View>
    );
  }

  const live = liveOf(event);
  const isLive = !!live?.is_live;
  const category = categoryById(event.category);
  const ink = dark ? DUSK_INK : surfaceFor(category.id).ink;
  const hostName = event.host?.username ?? 'Someone';
  const players = event.max_players
    ? `${event.player_count}/${event.max_players} playing`
    : `${event.player_count} playing`;
  const going = attendees.some((a) => a.user_id === userId);
  const open = event.status === 'upcoming' || event.status === 'live';
  const teams = scoreTeams(live?.score ?? null);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerTintColor: ink }} />

      <View
        style={[styles.hero, { paddingTop: insets.top + 52 }, !isLive && styles.heroCourt]}
        onLayout={(e) => setHero({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
        <SportSurface sport={category.id} width={hero.width} height={hero.height} top={heroTop} />
        <Text style={[styles.title, { color: ink }]} accessibilityRole="header">
          {event.title}
        </Text>
        <Text
          style={[styles.heroMeta, { color: ink }]}
          onLayout={(e) => setHeroTop(e.nativeEvent.layout.y + e.nativeEvent.layout.height + 10)}>
          {`${category.label} · ${event.location_text}`}
        </Text>

        {isLive ? (
          <View style={styles.liveCard}>
            <LiveLabel startedAt={live.started_at} />
            <ScoreTile startedAt={live.started_at} score={live.score} size="lg" />
            {teams ? <Text style={styles.teams}>{teams}</Text> : null}
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.hostRow}>
          <Avatar name={hostName} size={44} />
          <View style={styles.hostText}>
            <Text style={styles.hostName}>{hostName}</Text>
            <Text style={styles.caption}>Hosting</Text>
          </View>
        </View>

        <View style={styles.facts}>
          <Meta icon="time-outline" text={isLive ? 'Happening now' : formatWhen(event.start_time)} />
          <Meta icon="location-outline" text={event.location_text} />
          <Meta icon="people-outline" text={`${event.attendee_count} going · ${players}`} />
        </View>

        {event.description ? <Text style={styles.description}>{event.description}</Text> : null}

        {open ? (
          <Button
            title={going ? 'Leave game' : userId ? "I'm in" : 'Sign in to join'}
            icon={going || !userId ? undefined : 'checkmark'}
            variant={going ? 'secondary' : 'primary'}
            busy={busy}
            onPress={toggleRsvp}
          />
        ) : (
          <Text style={styles.over}>This game is over.</Text>
        )}
        {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Who&apos;s going
          </Text>
          {userId ? (
            attendees.length > 0 ? (
              <View style={styles.roster}>
                {attendees.map((a) => (
                  <View key={a.user_id} style={styles.person}>
                    <Avatar name={a.profile?.username ?? '?'} size={36} />
                    <Text style={styles.personName}>{a.profile?.username ?? 'Player'}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.quiet}>No one yet. Be the first.</Text>
            )
          ) : (
            <View style={styles.locked}>
              <Ionicons name="lock-closed" size={20} color={c.inkSoft} />
              <Text style={styles.lockedText}>
                {event.attendee_count > 0
                  ? `${event.attendee_count} going. Sign in to see who.`
                  : 'Sign in to see who’s going.'}
              </Text>
              <Button title="Sign in" variant="secondary" onPress={() => router.push('/sign-in')} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const useStyles = createStyles((c) => ({
  screen: { flex: 1, backgroundColor: c.ground },
  content: { paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32, backgroundColor: c.ground },
  heading: { ...type.title, color: c.ink, textAlign: 'center' },
  hero: {
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    minHeight: 240,
    justifyContent: 'flex-end',
    gap: 4,
  },
  heroCourt: { paddingBottom: 150 },
  title: { ...type.display },
  heroMeta: { ...type.body, opacity: 0.92 },
  liveCard: {
    marginTop: 16,
    padding: 16,
    gap: 12,
    borderRadius: radius.lg,
    backgroundColor: c.paper,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  teams: { ...type.headline, color: c.ink, textAlign: 'center' },
  body: { padding: 16, gap: 18 },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hostText: { gap: 1 },
  hostName: { ...type.headline, color: c.ink },
  caption: { ...type.meta, color: c.inkSoft },
  facts: { gap: 10, padding: 16, borderRadius: radius.lg, backgroundColor: c.paper, borderWidth: 1, borderColor: c.line },
  description: { ...type.body, color: c.ink },
  over: { ...type.body, color: c.inkSoft, textAlign: 'center' },
  error: { ...type.meta, color: c.danger },
  section: { gap: 12, marginTop: 6 },
  sectionTitle: { ...type.title, color: c.ink },
  roster: { gap: 12 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  personName: { ...type.body, color: c.ink },
  quiet: { ...type.body, color: c.inkSoft },
  locked: {
    alignItems: 'center',
    gap: 10,
    padding: 18,
    borderRadius: radius.lg,
    backgroundColor: c.paper,
    borderWidth: 1,
    borderColor: c.line,
  },
  lockedText: { ...type.body, ...type.numeric, color: c.inkSoft, textAlign: 'center' },
}));
