import { Pressable, Text, View } from 'react-native';

import { categoryById } from '@/lib/categories';
import { formatClock, formatDistance, formatStart, scoreTeams, type FeedSection } from '@/lib/format';
import { createStyles, radius, type } from '@/lib/theme';
import type { FeedEvent } from '@/lib/types';
import { LiveLabel, ScoreTile } from './LiveScore';
import { SportThumb } from './SportSurface';

// Spots as the card's right-hand fact: "6 left", "Full", or a plain head count when there's no cap.
function spots(event: FeedEvent) {
  if (!event.max_players) return { big: String(event.attendee_count), small: 'going', full: false };
  const left = event.max_players - event.player_count;
  if (left <= 0) return { big: 'Full', small: `${event.max_players} playing`, full: true };
  return { big: String(left), small: left === 1 ? 'spot left' : 'spots left', full: false };
}

// One upcoming game: its court, when, where, and how many spots are left. Counts only, never names;
// attendee names are for signed-in users and live on the detail screen.
export function FeedCard({
  event,
  section,
  onPress,
}: {
  event: FeedEvent;
  section: FeedSection;
  onPress: () => void;
}) {
  const styles = useStyles();
  const category = categoryById(event.category);
  const relative = formatStart(event.start_time);
  const started = relative.startsWith('Started');
  const when = started || section !== 'today' ? relative : formatClock(event.start_time);
  const s = spots(event);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${category.label}, ${when}, ${event.location_text}, ${s.big} ${s.small}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <SportThumb sport={category.id} />
      <View style={styles.body}>
        <Text style={styles.when} numberOfLines={1}>
          {when}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {`${event.location_text} · ${formatDistance(event.distance_m)}`}
        </Text>
      </View>
      <View style={styles.spots}>
        <Text style={[styles.spotsBig, s.full && styles.spotsFull]} numberOfLines={1}>
          {s.big}
        </Text>
        <Text style={styles.spotsSmall}>{s.small}</Text>
      </View>
    </Pressable>
  );
}

// A live game sitting on the court banner: the score tile, the ticking clock, who's hosting.
export function LiveCard({ event, onPress }: { event: FeedEvent; onPress: () => void }) {
  const styles = useStyles();
  const category = categoryById(event.category);
  const teams = scoreTeams(event.score);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Live ${category.label}: ${event.title}, ${event.location_text}`}
      style={({ pressed }) => [styles.live, pressed && styles.pressed]}>
      <ScoreTile startedAt={event.live_started_at} score={event.score} />
      <View style={styles.body}>
        <LiveLabel startedAt={event.live_started_at} />
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {teams ?? `${event.location_text} · ${formatDistance(event.distance_m)}`}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {teams
            ? `${event.location_text} · ${formatDistance(event.distance_m)}`
            : `${event.host_username} hosting`}
        </Text>
      </View>
    </Pressable>
  );
}

const useStyles = createStyles((c) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: c.paper,
    borderWidth: 1,
    borderColor: c.line,
  },
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: c.paper,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  body: { flex: 1, gap: 2 },
  when: { ...type.meta, ...type.numeric, color: c.navy },
  title: { ...type.headline, color: c.ink },
  meta: { ...type.meta, ...type.numeric, color: c.inkSoft },
  spots: { alignItems: 'flex-end', minWidth: 54 },
  spotsBig: { ...type.title, ...type.numeric, color: c.ink },
  spotsFull: { color: c.inkFaint, textDecorationLine: 'line-through' },
  spotsSmall: { ...type.small, ...type.numeric, color: c.inkSoft },
}));
