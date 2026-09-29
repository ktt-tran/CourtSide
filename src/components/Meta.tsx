import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { IconName } from '@/lib/categories';
import { colors, fontSize } from '@/lib/theme';

// One line of "icon + fact", used for the place, time, and counts on cards and the detail screen.
export function Meta({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={15} color={colors.inkSoft} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 },
  text: { fontSize: fontSize.meta, color: colors.inkSoft, flexShrink: 1 },
});
