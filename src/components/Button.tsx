import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import type { IconName } from '@/lib/categories';
import { createStyles, radius, type, usePalette } from '@/lib/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: IconName;
  busy?: boolean;
  disabled?: boolean;
};

// A pill. Primary is key paint (orange with dark ink); secondary is a white pill with a hairline.
export function Button({ title, onPress, variant = 'primary', icon, busy = false, disabled = false }: Props) {
  const styles = useStyles();
  const c = usePalette();
  const primary = variant === 'primary';
  const textColor = primary ? c.onAccent : c.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy, busy }}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        pressed && (primary ? styles.primaryPressed : styles.secondaryPressed),
        disabled && styles.disabled,
      ]}>
      {busy ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={18} color={textColor} /> : null}
          <Text style={[styles.label, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const useStyles = createStyles((c) => ({
  base: {
    minHeight: 50,
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primary: { backgroundColor: c.accent },
  primaryPressed: { backgroundColor: '#E85A1D' },
  secondary: { backgroundColor: c.paper, borderWidth: 1.5, borderColor: c.line },
  secondaryPressed: { backgroundColor: c.pressed },
  disabled: { opacity: 0.45 },
  label: { ...type.headline, fontSize: 16 },
}));
