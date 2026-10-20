import { Pressable, ScrollView, Text } from 'react-native';

import { createStyles, radius, type } from '@/lib/theme';

type Option<T> = { value: T; label: string };

// A horizontal row of single-select pills. Used for the sport filter, the sport picker, and start times.
// `onSurface` is for chips sitting on a painted court banner: they get an opaque white ground.
export function Chips<T extends string | number | null>({
  options,
  value,
  onChange,
  onSurface = false,
  inset = 0,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  onSurface?: boolean;
  inset?: number;
}) {
  const styles = useStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.row, { paddingHorizontal: inset }]}
      keyboardShouldPersistTaps="handled">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            hitSlop={{ top: 5, bottom: 5 }}
            style={({ pressed }) => [
              styles.chip,
              onSurface && styles.chipOnSurface,
              selected && styles.chipSelected,
              pressed && !selected && styles.chipPressed,
            ]}>
            <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const useStyles = createStyles((c) => ({
  row: { gap: 8, paddingVertical: 2 },
  chip: {
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: c.line,
    backgroundColor: c.paper,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  chipOnSurface: { borderColor: 'transparent' },
  chipSelected: { backgroundColor: c.navy, borderColor: c.navy },
  chipPressed: { backgroundColor: c.pressed },
  label: { ...type.meta, ...type.numeric, color: c.ink },
  labelSelected: { color: c.onNavy },
}));
