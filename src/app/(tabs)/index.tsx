import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chips } from '@/components/Chips';
import { FeedCard } from '@/components/FeedCard';
import { categoryOptions } from '@/lib/categories';
import { DEFAULT_RADIUS_M } from '@/lib/config';
import { useLocation } from '@/lib/location';
import { useLiveStateUpdates } from '@/lib/realtime';
import { supabase } from '@/lib/supabase';
import { colors, fontSize } from '@/lib/theme';
import type { FeedEvent } from '@/lib/types';

const FILTERS: { value: string | null; label: string }[] = [
  { value: null, label: 'All' },
  ...categoryOptions,
];

function Separator() {
  return <View style={{ height: 12 }} />;
}

// The feed: games near you, soonest first, live games on top. Works for guests and signed-in users alike.
export default function Feed() {
  const router = useRouter();
  const { coords, status, retry } = useLocation();
  const [category, setCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(false);
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

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View style={styles.center}>
        <Ionicons name="navigate-outline" size={28} color={colors.inkFaint} />
        <Text style={styles.heading}>Location is off</Text>
        <Text style={styles.body}>Turn on location to see games near you.</Text>
        <Button title="Try again" onPress={retry} />
        <Button title="Open settings" variant="secondary" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.filters}>
        <Chips options={FILTERS} value={category} onChange={setCategory} />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Couldn&apos;t load games</Text>
          <Text style={styles.errorBody}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={events}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <FeedCard
            event={item}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
          />
        )}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Text style={styles.heading}>No games near you yet</Text>
              <Text style={styles.body}>Be the first to host one.</Text>
              <Button title="Host game" onPress={() => router.push('/create')} />
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  filters: { paddingHorizontal: 16, paddingVertical: 10 },
  list: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  empty: { alignItems: 'center', gap: 12, paddingTop: 64 },
  heading: { fontSize: 18, fontWeight: '500', color: colors.ink, textAlign: 'center' },
  body: { fontSize: fontSize.body, color: colors.inkSoft, textAlign: 'center', lineHeight: 22 },
  errorBox: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.live,
    gap: 2,
  },
  errorTitle: { fontSize: fontSize.meta, fontWeight: '500', color: colors.live },
  errorBody: { fontSize: fontSize.small, color: colors.inkSoft },
});
