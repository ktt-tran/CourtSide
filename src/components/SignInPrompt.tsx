import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { createStyles, radius, type } from '@/lib/theme';
import { Button } from './Button';
import { SportThumb } from './SportSurface';

// Shown wherever a guest hits something that needs an account.
export function SignInPrompt({ title, message }: { title: string; message: string }) {
  const styles = useStyles();
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <View style={styles.courts}>
        <SportThumb sport="basketball" size={72} style={styles.tiltLeft} />
        <SportThumb sport="soccer" size={72} />
        <SportThumb sport="tennis" size={72} style={styles.tiltRight} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{message}</Text>
      <View style={styles.action}>
        <Button title="Sign in or create account" onPress={() => router.push('/sign-in')} />
      </View>
    </View>
  );
}

const useStyles = createStyles((c) => ({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  courts: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  tiltLeft: { transform: [{ rotate: '-6deg' }, { translateY: 6 }], borderRadius: radius.md },
  tiltRight: { transform: [{ rotate: '6deg' }, { translateY: 6 }], borderRadius: radius.md },
  title: { ...type.title, color: c.ink, textAlign: 'center' },
  text: { ...type.body, color: c.inkSoft, textAlign: 'center', maxWidth: 300 },
  action: { marginTop: 14, alignSelf: 'stretch' },
}));
