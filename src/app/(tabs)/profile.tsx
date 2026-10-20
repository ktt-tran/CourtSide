import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { SignInPrompt } from '@/components/SignInPrompt';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { createStyles, type } from '@/lib/theme';

export default function Profile() {
  const styles = useStyles();
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
    return (
      <SignInPrompt
        title="Get in the game"
        message="Sign in to host games, join them, and see who's playing."
      />
    );
  }

  const name = username ?? session.user.email ?? 'You';
  return (
    <View style={styles.screen}>
      <Avatar name={name} size={80} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{session.user.email}</Text>
      <View style={styles.action}>
        <Button title="Sign out" variant="secondary" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const useStyles = createStyles((c) => ({
  screen: { flex: 1, alignItems: 'center', paddingTop: 40, gap: 4, paddingHorizontal: 24 },
  name: { ...type.title, color: c.ink, marginTop: 14 },
  email: { ...type.body, color: c.inkSoft },
  action: { marginTop: 28, alignSelf: 'stretch' },
}));
