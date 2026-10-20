import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chips } from '@/components/Chips';
import { Field } from '@/components/Field';
import { Meta } from '@/components/Meta';
import { SignInPrompt } from '@/components/SignInPrompt';
import { SportThumb } from '@/components/SportSurface';
import { useAuth } from '@/lib/auth';
import { CATEGORIES } from '@/lib/categories';
import { useLocation } from '@/lib/location';
import { supabase } from '@/lib/supabase';
import { createStyles, radius, type } from '@/lib/theme';

// Presets keep the form to one tap. Swap in a date/time picker when you want exact times.
const START_OPTIONS = [
  { value: 30, label: 'In 30 min' },
  { value: 60, label: 'In 1 hour' },
  { value: 180, label: 'In 3 hours' },
  { value: 1440, label: 'Same time tomorrow' },
];

export default function Create() {
  const styles = useStyles();
  const { session } = useAuth();
  const router = useRouter();
  const { coords, status, retry } = useLocation();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('basketball');
  const [venue, setVenue] = useState('');
  const [startInMinutes, setStartInMinutes] = useState(60);
  const [maxPlayers, setMaxPlayers] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <SignInPrompt
        title="Start a game"
        message="Sign in to host. Your game shows up for everyone nearby, and you can keep score live."
      />
    );
  }
  const userId = session.user.id;

  async function submit() {
    if (!coords) {
      setError('We need your location to put the game on the map.');
      return;
    }
    if (!title.trim() || !venue.trim()) {
      setError('Add a title and the name of the place.');
      return;
    }
    const players = maxPlayers.trim() ? Number.parseInt(maxPlayers, 10) : null;
    if (players !== null && (!Number.isFinite(players) || players < 1)) {
      setError('Max players must be a number above zero.');
      return;
    }

    setBusy(true);
    setError(null);
    const { data, error: insertError } = await supabase
      .from('events')
      .insert({
        host_id: userId,
        category,
        title: title.trim(),
        description: description.trim() || null,
        location_text: venue.trim(),
        // PostGIS reads "POINT(longitude latitude)": longitude first, one space, no comma.
        location: `POINT(${coords.longitude} ${coords.latitude})`,
        start_time: new Date(Date.now() + startInMinutes * 60_000).toISOString(),
        max_players: players,
      })
      .select('id')
      .single();
    setBusy(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTitle('');
    setVenue('');
    setMaxPlayers('');
    setDescription('');
    router.push({ pathname: '/event/[id]', params: { id: data.id } });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Field
        label="Title"
        placeholder="Sunday run"
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />

      <View style={styles.group}>
        <Text style={styles.label}>Sport</Text>
        <View style={styles.sports}>
          {CATEGORIES.map((sport) => {
            const selected = sport.id === category;
            return (
              <Pressable
                key={sport.id}
                onPress={() => setCategory(sport.id)}
                accessibilityRole="button"
                accessibilityLabel={sport.label}
                accessibilityState={{ selected }}
                style={({ pressed }) => [styles.sport, selected && styles.sportSelected, pressed && styles.sportPressed]}>
                <SportThumb sport={sport.id} size={56} />
                <Text style={[styles.sportLabel, selected && styles.sportLabelSelected]}>{sport.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.group}>
        <Field
          label="Place"
          placeholder="Riverside Courts"
          value={venue}
          onChangeText={setVenue}
          maxLength={120}
        />
        {/* Until address search exists, the game is pinned to wherever you're standing. */}
        {status === 'granted' ? (
          <Meta icon="navigate-outline" text="Pinned to your current location" />
        ) : status === 'loading' ? (
          <Meta icon="navigate-outline" text="Finding your location" />
        ) : (
          <View style={styles.locationOff}>
            <Meta icon="navigate-outline" text="Location is off, so the game can't be placed." />
            <Button title="Try again" variant="secondary" onPress={retry} />
          </View>
        )}
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>When</Text>
        <View style={styles.bleed}>
          <Chips options={START_OPTIONS} value={startInMinutes} onChange={setStartInMinutes} inset={16} />
        </View>
      </View>

      <Field
        label="Max players (optional)"
        placeholder="10"
        keyboardType="number-pad"
        value={maxPlayers}
        onChangeText={setMaxPlayers}
        maxLength={3}
      />

      <Field
        label="Description (optional)"
        placeholder="All levels welcome. Bring a ball if you have one."
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={1000}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Host game" icon="add" onPress={submit} busy={busy} disabled={status !== 'granted'} />
    </ScrollView>
  );
}

const useStyles = createStyles((c) => ({
  content: { padding: 16, gap: 22, paddingBottom: 48 },
  group: { gap: 10 },
  label: { ...type.meta, color: c.inkSoft },
  locationOff: { gap: 10 },
  bleed: { marginHorizontal: -16 },
  error: { ...type.meta, color: c.danger },
  sports: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sport: {
    width: '31%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: c.line,
    backgroundColor: c.paper,
  },
  sportSelected: { borderColor: c.navy },
  sportPressed: { backgroundColor: c.pressed },
  sportLabel: { ...type.meta, color: c.inkSoft },
  sportLabelSelected: { color: c.ink },
}));
