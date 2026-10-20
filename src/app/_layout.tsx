import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/lib/auth';
import { fonts, usePalette } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const c = usePalette();
  const [loaded, error] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Hold the splash until Nunito is in; if it fails, the system font carries the UI.
  if (!loaded && !error) return null;

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.ground },
          headerShadowVisible: false,
          headerTintColor: c.ink,
          headerTitleStyle: { fontFamily: fonts.black, fontSize: 18 },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: c.ground },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{
            title: '',
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },
            scrollEdgeEffects: { top: 'hidden' },
          }} />
        <Stack.Screen name="sign-in" options={{ title: 'Sign in', presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
