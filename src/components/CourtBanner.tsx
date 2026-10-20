import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DUSK_INK, surfaceFor } from '@/lib/surfaces';
import { createStyles, type, useIsDark } from '@/lib/theme';
import { SportSurface } from './SportSurface';

// The top of the feed: the selected sport's play area painted edge to edge under the status bar,
// with the headline, the sport chips, and any live games sitting right on the court.
export function CourtBanner({
  sport,
  headline,
  note,
  chips,
  children,
}: {
  sport: string;
  headline: string;
  note?: string | null;
  chips: ReactNode;
  children?: ReactNode;
}) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const dark = useIsDark();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ink = dark ? DUSK_INK : surfaceFor(sport).ink;
  // Markings start below the chips. Built from heights, not positions: on web, onLayout only fires on resize.
  const [textHeight, setTextHeight] = useState(0);
  const [chipsHeight, setChipsHeight] = useState(0);
  const paddingTop = insets.top + 14;
  const markingsTop = paddingTop + textHeight + CHIPS_GAP + chipsHeight + 14;

  return (
    <View
      style={[styles.banner, { paddingTop }, !children && styles.courtRoom]}
      onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
      <SportSurface sport={sport} width={size.width} height={size.height} top={markingsTop} />
      <View style={styles.text} onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}>
        <Text
          style={[styles.headline, { color: ink }]}
          accessibilityRole="header"
          lineBreakStrategyIOS="standard"
          textBreakStrategy="balanced">
          {headline}
        </Text>
        {note ? <Text style={[styles.note, { color: ink }]}>{note}</Text> : null}
      </View>
      <View
        style={styles.chips}
        onLayout={(e) => setChipsHeight(e.nativeEvent.layout.height)}>
        {chips}
      </View>
      {children ? <View style={styles.live}>{children}</View> : null}
    </View>
  );
}

const CHIPS_GAP = 16;

const useStyles = createStyles(() => ({
  banner: {
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 18,
    minHeight: 220,
  },
  // With nothing live on it, the banner keeps room for one whole court end below the chips.
  courtRoom: { paddingBottom: 130 },
  text: { paddingHorizontal: 16, gap: 4 },
  headline: { ...type.display, ...type.numeric },
  note: { ...type.body, opacity: 0.92 },
  chips: { marginTop: CHIPS_GAP },
  live: { marginTop: 16, paddingHorizontal: 16, gap: 10 },
}));
