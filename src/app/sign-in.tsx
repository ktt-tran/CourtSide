import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { supabase } from '@/lib/supabase';
import { colors, fontSize } from '@/lib/theme';

export default function SignIn() {
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

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  message: { fontSize: fontSize.meta, color: colors.inkSoft, lineHeight: 19 },
  switch: { fontSize: fontSize.body, color: colors.accent, textAlign: 'center', paddingVertical: 8 },
});
