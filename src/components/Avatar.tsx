import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/lib/theme';

// Initials on a tinted circle. Swap in profile photos once uploads exist (profiles.photo_url).
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.trim().slice(0, 2).toUpperCase() || '?';
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.accentInk, fontWeight: '500' },
});
