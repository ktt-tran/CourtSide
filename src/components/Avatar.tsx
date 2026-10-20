import { Text, View } from 'react-native';

import { createStyles, fonts } from '@/lib/theme';

// Initials on a tinted circle. Swap in profile photos once uploads exist (profiles.photo_url).
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const styles = useStyles();
  const initials = name.trim().slice(0, 2).toUpperCase() || '?';
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.38) }]} allowFontScaling={false}>
        {initials}
      </Text>
    </View>
  );
}

const useStyles = createStyles((c) => ({
  circle: { backgroundColor: c.navyTint, alignItems: 'center', justifyContent: 'center' },
  initials: { color: c.navy, fontFamily: fonts.black },
}));
