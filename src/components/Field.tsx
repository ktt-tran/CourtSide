import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontSize, radius } from '@/lib/theme';

export function Field({ label, style, ...input }: { label: string } & TextInputProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.inkFaint}
        {...input}
        style={[styles.input, input.multiline && styles.multiline, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: fontSize.meta, color: colors.inkSoft, fontWeight: '500' },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    paddingHorizontal: 12,
    fontSize: fontSize.body,
    color: colors.ink,
  },
  multiline: { minHeight: 88, paddingTop: 10, textAlignVertical: 'top' },
});
