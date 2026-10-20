import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { IconName } from '@/lib/categories';
import { createStyles, type, usePalette } from '@/lib/theme';

// One line of "icon + fact", used for the place, time, and counts on the detail screen and the Host form.
export function Meta({ icon, text }: { icon: IconName; text: string }) {
  const styles = useStyles();
  const c = usePalette();
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={17} color={c.inkSoft} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const useStyles = createStyles((c) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  text: { ...type.body, ...type.numeric, color: c.inkSoft, flexShrink: 1 },
}));
