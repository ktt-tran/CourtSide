import { useFocusEffect, useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, RefreshControl, SectionList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Chips } from '@/components/Chips';
import { CourtBanner } from '@/components/CourtBanner';
import { FeedCard, LiveCard } from '@/components/FeedCard';
import { SportThumb } from '@/components/SportSurface';
import { categoryOptions } from '@/lib/categories';
import { DEFAULT_RADIUS_M } from '@/lib/config';
import { feedHeadline, formatClock, formatStart, sectionOf, type FeedSection } from '@/lib/format';
import { useLocation } from '@/lib/location';
import { useLiveStateUpdates } from '@/lib/realtime';
import { supabase } from '@/lib/supabase';
import { surfaceFor } from '@/lib/surfaces';
import { createStyles, radius, type, useIsDark, usePalette } from '@/lib/theme';
import type { FeedEvent } from '@/lib/types';

const FILTERS: { value: string | null; label: string }[] = [
  { value: null, label: 'All' },
  ...categoryOptions,
];

const SECTION_TITLES: Record<FeedSection, string> = {
  today: 'Today',
  week: 'Later this week',
  later: 'Further out',
};

type Section = { key: FeedSection; title: string; data: FeedEvent[] };

function Separator() {
  return <View style={{ height: 10 }} />;
}

// The feed: the selected sport's court up top with anything live on it, then Today, then the week.
// Works for guests and signed-in users alike.
export default function Feed() {
  const styles = useStyles();
  const c = usePalette();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { coords, status, retry } = useLocation();
  const [category, setCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!coords) return;
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('nearby_events', {
      user_lat: coords.latitude,
      user_lng: coords.longitude,
      radius_m: DEFAULT_RADIUS_M,
      category_filter: category,
    });
    if (rpcError) {
      setError(rpcError.message);
    } else {
      setEvents((data ?? []) as FeedEvent[]);
    }
    setLoading(false);
    setLoadedOnce(true);
  }, [coords, category]);

  // Reload whenever this tab comes into focus, so a new game or RSVP made elsewhere shows up.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Keep live scores fresh without refetching the whole feed.
  useLiveStateUpdates((row) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === row.event_id
          ? { ...e, is_live: row.is_live, live_started_at: row.started_at, score: row.score }
          : e,
      ),
    );
  });

  const live = useMemo(() => events.filter((e) => e.is_live), [events]);
  const sections = useMemo(() => {
    const groups: Record<FeedSection, FeedEvent[]> = { today: [], week: [], later: [] };
    for (const e of events) if (!e.is_live) groups[sectionOf(e.start_time)].push(e);
    return (Object.keys(groups) as FeedSection[])
      .filter((key) => groups[key].length > 0)
      .map<Section>((key) => ({ key, title: SECTION_TITLES[key], data: groups[key] }));
  }, [events]);

  // Under "All", the banner paints the court of whatever is live, else the next game, else hardwood.
  const sport = category ?? live[0]?.category ?? events[0]?.category ?? 'basketball';
  const noun = category ? surfaceFor(category).noun : null;

  // The status bar sits on the painted court, so its ink follows the surface.
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(dark || surfaceFor(sport).ink === '#FFFFFF' ? 'light' : 'dark');
      return () => setStatusBarStyle('auto');
    }, [dark, sport]),
  );

  const open = (id: string) => router.push({ pathname: '/event/[id]', params: { id } });
  const chips = <Chips options={FILTERS} value={category} onChange={setCategory} onSurface inset={16} />;

  if (status === 'denied') {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <SportThumb sport="other" size={80} />
        <Text style={styles.heading}>Location is off</Text>
        <Text style={styles.body}>CourtSide needs your location to show games near you.</Text>
        <View style={styles.actions}>
          <Button title="Try again" onPress={retry} />
          <Button title="Open settings" variant="secondary" onPress={() => Linking.openSettings()} />
        </View>
      </View>
    );
  }

  let note: string | null = null;
  if (status === 'loading' || !loadedOnce) note = null;
  else if (live.length === 0 && events.length > 0) {
    const next = sections[0]?.data[0];
    if (sections[0]?.key !== 'today') note = 'Nothing on today. Here’s the week ahead.';
    else if (next && !formatStart(next.start_time).startsWith('Started'))
      note = `Nothing live right now. Next up at ${formatClock(next.start_time)}.`;
    else note = 'Nothing live right now.';
  }

  const headline =
    status === 'loading' || !loadedOnce ? 'Finding games near you' : feedHeadline(events.length, noun);

  const banner = (
    <CourtBanner sport={sport} headline={headline} note={note} chips={chips}>
      {live.length > 0 ? live.map((e) => <LiveCard key={e.id} event={e} onPress={() => open(e.id)} />) : null}
    </CourtBanner>
  );

  return (
    <SectionList
      style={styles.screen}
      sections={sections}
      keyExtractor={(e) => e.id}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <>
          {banner}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Couldn&apos;t load games</Text>
              <Text style={styles.errorBody}>{error}</Text>
              <Button title="Try again" variant="secondary" onPress={load} />
            </View>
          ) : null}
        </>
      }
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {section.title}
        </Text>
      )}
      renderItem={({ item, section }) => (
        <View style={styles.item}>
          <FeedCard event={item} section={section.key} onPress={() => open(item.id)} />
        </View>
      )}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={loading && loadedOnce} onRefresh={load} tintColor={c.inkSoft} />}
      ListEmptyComponent={
        status === 'loading' || !loadedOnce ? (
          <View style={styles.empty}>
            <ActivityIndicator color={c.inkSoft} />
          </View>
        ) : events.length === 0 && !error ? (
          <View style={styles.empty}>
            <Text style={styles.heading}>Nothing on yet</Text>
            <Text style={styles.body}>
              {noun
                ? `No ${noun} games near you this week. Start one and people nearby will see it.`
                : 'No games near you this week. Start one and people nearby will see it.'}
            </Text>
            <View style={styles.actions}>
              <Button title="Host a game" icon="add" onPress={() => router.push('/create')} />
            </View>
          </View>
        ) : null
      }
    />
  );
}

const useStyles = createStyles((c) => ({
  screen: { flex: 1, backgroundColor: c.ground },
  list: { paddingBottom: 32, flexGrow: 1 },
  item: { paddingHorizontal: 16 },
  sectionTitle: {
    ...type.section,
    textTransform: 'uppercase',
    color: c.inkSoft,
    paddingHorizontal: 16,
    paddingTop: 26,
    paddingBottom: 10,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 32,
    backgroundColor: c.ground,
  },
  empty: { alignItems: 'center', gap: 10, paddingTop: 40, paddingHorizontal: 32 },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 14 },
  heading: { ...type.title, color: c.ink, textAlign: 'center' },
  body: { ...type.body, color: c.inkSoft, textAlign: 'center', maxWidth: 320 },
  errorBox: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: c.dangerTint,
    gap: 6,
  },
  errorTitle: { ...type.headline, color: c.danger },
  errorBody: { ...type.meta, color: c.ink, marginBottom: 6 },
}));
