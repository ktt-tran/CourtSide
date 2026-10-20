import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { createStyles, radius, type, usePalette } from '@/lib/theme';

export function Field({ label, style, ...input }: { label: string } & TextInputProps) {
  const styles = useStyles();
  const c = usePalette();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={c.inkFaint}
        selectionColor={c.navy}
        cursorColor={c.navy}
        {...input}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur?.(e);
        }}
        style={[styles.input, input.multiline && styles.multiline, focused && styles.focused, style]}
      />
    </View>
  );
}

const useStyles = createStyles((c) => ({
  wrap: { gap: 8 },
  label: { ...type.meta, color: c.inkSoft },
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: c.line,
    borderRadius: radius.md,
    backgroundColor: c.paper,
    paddingHorizontal: 14,
    ...type.body,
    ...type.numeric,
    color: c.ink,
  },
  focused: { borderColor: c.navy },
  multiline: { minHeight: 100, paddingTop: 13, paddingBottom: 13, textAlignVertical: 'top' },
}));
