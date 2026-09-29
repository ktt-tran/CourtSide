import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { SignInPrompt } from '@/components/SignInPrompt';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { colors, fontSize } from '@/lib/theme';

export default function Profile() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()
      .then(({ data }) => setUsername(data?.username ?? null));
  }, [userId]);

  if (!session) {
    return <SignInPrompt message="Sign in to host games, join them, and see who's playing." />;
  }

  const name = username ?? session.user.email ?? 'You';
  return (
    <View style={styles.screen}>
      <Avatar name={name} size={64} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{session.user.email}</Text>
      <View style={styles.action}>
        <Button title="Sign out" variant="secondary" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', paddingTop: 48, gap: 8, paddingHorizontal: 24 },
  name: { fontSize: 20, fontWeight: '500', color: colors.ink, marginTop: 8 },
  email: { fontSize: fontSize.meta, color: colors.inkSoft },
  action: { marginTop: 24, alignSelf: 'stretch' },
});
