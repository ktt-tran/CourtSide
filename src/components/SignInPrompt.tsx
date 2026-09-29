import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize } from '@/lib/theme';
import { Button } from './Button';

// Shown wherever a guest hits something that needs an account.
export function SignInPrompt({ message }: { message: string }) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <Ionicons name="lock-closed-outline" size={28} color={colors.inkFaint} />
      <Text style={styles.text}>{message}</Text>
      <Button title="Sign in" onPress={() => router.push('/sign-in')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32 },
  text: { fontSize: fontSize.body, color: colors.inkSoft, textAlign: 'center', lineHeight: 22 },
});
