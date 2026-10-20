import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { SportThumb } from '@/components/SportSurface';
import { supabase } from '@/lib/supabase';
import { createStyles, type } from '@/lib/theme';

export default function SignIn() {
  const styles = useStyles();
  const router = useRouter();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function done() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  async function submit() {
    setBusy(true);
    setMessage(null);
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setMessage(error.message);
      else done();
    } else {
      // The username travels as signup metadata; a database trigger turns it into the profile row.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { username: username.trim() } },
      });
      if (error) setMessage(error.message);
      else if (!data.session) setMessage('Check your email to confirm your account, then sign in.');
      else done();
    }
    setBusy(false);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Stack.Screen options={{ title: mode === 'in' ? 'Sign in' : 'Create account' }} />
      <View style={styles.intro}>
        <SportThumb sport="basketball" size={56} />
        <Text style={styles.heading}>{mode === 'in' ? 'Welcome back' : 'Join the run'}</Text>
        <Text style={styles.sub}>
          {mode === 'in'
            ? 'Sign in to join games and see who\u2019s playing.'
            : 'Pick a username people will see when you host or join.'}
        </Text>
      </View>
      {mode === 'up' ? (
        <Field
          label="Username"
          placeholder="hoops_dana"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={30}
        />
      ) : null}
      <Field
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
      />
      <Field
        label="Password"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Button
        title={mode === 'in' ? 'Sign in' : 'Create account'}
        onPress={submit}
        busy={busy}
        disabled={!email.trim() || password.length < 6}
      />

      <Pressable onPress={() => setMode(mode === 'in' ? 'up' : 'in')} accessibilityRole="button">
        <Text style={styles.switch}>
          {mode === 'in' ? 'New here? Create an account' : 'Have an account? Sign in'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const useStyles = createStyles((c) => ({
  content: { padding: 20, gap: 18, paddingBottom: 40 },
  intro: { gap: 6, marginBottom: 6 },
  heading: { ...type.display, color: c.ink, marginTop: 12 },
  sub: { ...type.body, color: c.inkSoft },
  message: { ...type.meta, color: c.inkSoft },
  switch: { ...type.headline, fontSize: 16, color: c.accentInk, textAlign: 'center', paddingVertical: 12 },
}));
