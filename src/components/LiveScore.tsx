import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useElapsed } from '@/lib/elapsed';
import { scoreNumbers } from '@/lib/format';
import { createStyles, radius, type } from '@/lib/theme';
import type { Score } from '@/lib/types';

// The one moving thing in the app: a dot that breathes while a game is live. Still under Reduce Motion.
export function LiveDot({ size = 8 }: { size?: number }) {
  const styles = useStyles();
  const reduced = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }), -1, false);
    return () => cancelAnimation(pulse);
  }, [reduced, pulse]);

  const ring = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 1.4 }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      {reduced ? null : (
        <Animated.View
          style={[styles.dot, { width: size, height: size, borderRadius: size / 2, position: 'absolute' }, ring]}
        />
      )}
      <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2 }]} />
    </View>
  );
}

// "LIVE · 22:14", the clock ticking locally from started_at.
export function LiveLabel({ startedAt }: { startedAt: string | null }) {
  const styles = useStyles();
  const elapsed = useElapsed(startedAt);
  return (
    <View style={styles.label} accessibilityLabel={elapsed ? `Live, ${elapsed} elapsed` : 'Live'}>
      <LiveDot />
      <Text style={styles.labelText}>{elapsed ? `LIVE · ${elapsed}` : 'LIVE'}</Text>
    </View>
  );
}

// The key-paint tile: score in big tabular figures, clock underneath.
export function ScoreTile({
  startedAt,
  score,
  size = 'md',
}: {
  startedAt: string | null;
  score: Score | null;
  size?: 'md' | 'lg';
}) {
  const styles = useStyles();
  const elapsed = useElapsed(startedAt);
  const numbers = scoreNumbers(score);
  const large = size === 'lg';
  return (
    <View style={[styles.tile, large && styles.tileLarge]}>
      <Text
        style={[large ? styles.scoreLarge : styles.score, !numbers && styles.noScore]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {numbers ?? '0–0'}
      </Text>
      {elapsed ? <Text style={styles.clock}>{elapsed}</Text> : null}
    </View>
  );
}

const useStyles = createStyles((c) => ({
  dot: { backgroundColor: c.accent },
  label: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  labelText: { ...type.small, ...type.numeric, letterSpacing: 0.6, color: c.accentInk },
  tile: {
    minWidth: 92,
    minHeight: 68,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: c.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLarge: { minWidth: 0, alignSelf: 'stretch', paddingVertical: 18, borderRadius: radius.lg },
  score: { ...type.score, color: c.onAccent },
  scoreLarge: { ...type.scoreHuge, color: c.onAccent },
  noScore: { opacity: 0.55 },
  clock: { ...type.small, ...type.numeric, color: c.onAccent, marginTop: 1 },
}));
