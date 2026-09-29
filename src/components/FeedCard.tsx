import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { categoryById } from '@/lib/categories';
import { formatDistance, formatStart } from '@/lib/format';
import { colors, fontSize, radius } from '@/lib/theme';
import type { FeedEvent } from '@/lib/types';
import { Avatar } from './Avatar';
import { LiveScore } from './LiveScore';
import { Meta } from './Meta';

// One game in the feed. It only shows counts, never who is going: attendee names are for signed-in
// users and live on the detail screen. The host is public, like the author of a post.
export function FeedCard({ event, onPress }: { event: FeedEvent; onPress: () => void }) {
  const category = categoryById(event.category);
  const players = event.max_players
    ? `${event.player_count}/${event.max_players}`
    : `${event.player_count}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.hostRow}>
        <View style={styles.host}>
          <Avatar name={event.host_username} />
          <View>
            <Text style={styles.hostName}>{event.host_username}</Text>
            <Text style={styles.caption}>Hosting</Text>
          </View>
        </View>
        <Ionicons name={category.icon} size={20} color={colors.inkSoft} />
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.metaRow}>
        <Meta
          icon="location-outline"
          text={`${event.location_text} \u00B7 ${formatDistance(event.distance_m)}`}
        />
        <Meta icon="time-outline" text={event.is_live ? 'In progress' : formatStart(event.start_time)} />
      </View>
      <Meta icon="people-outline" text={`${event.attendee_count} going \u00B7 ${players} playing`} />

      {event.is_live ? <LiveScore startedAt={event.live_started_at} score={event.score} /> : null}

      {event.description ? (
        <Text numberOfLines={2} style={styles.description}>
          {event.description}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 10,
  },
  pressed: { opacity: 0.85 },
  hostRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  host: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hostName: { fontSize: 14, fontWeight: '500', color: colors.ink },
  caption: { fontSize: fontSize.small, color: colors.inkFaint },
  title: { fontSize: fontSize.body + 1, fontWeight: '500', color: colors.ink },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 4 },
  description: { fontSize: fontSize.meta, lineHeight: 19, color: colors.inkSoft },
});
