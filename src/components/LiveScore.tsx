import { StyleSheet, Text, View } from 'react-native';

import { useElapsed } from '@/lib/elapsed';
import { formatScore } from '@/lib/format';
import { colors, fontSize, radius } from '@/lib/theme';
import type { Score } from '@/lib/types';

// The live strip: a red dot, the running game clock, and the score. Used on the card and the detail screen.
export function LiveScore({ startedAt, score }: { startedAt: string | null; score: Score | null }) {
  const elapsed = useElapsed(startedAt);
  return (
    <View style={styles.box}>
      <View style={styles.status}>
        <View style={styles.dot} />
        <Text style={styles.live}>{elapsed ? `Live \u00B7 ${elapsed}` : 'Live'}</Text>
      </View>
      <Text style={styles.score} numberOfLines={1}>
        {formatScore(score)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: colors.ground,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.liveDot },
  live: { fontSize: fontSize.small, fontWeight: '500', color: colors.live },
  score: { flexShrink: 1, fontSize: 14, fontWeight: '500', color: colors.ink, textAlign: 'right' },
});
