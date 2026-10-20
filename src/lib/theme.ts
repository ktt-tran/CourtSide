import { StyleSheet, useColorScheme, type TextStyle } from 'react-native';

// One place to re-skin the app. Light is the default; dark follows the system, like a court after dusk.
// Neutrals carry structure, navy is the boundary paint (times, selection), orange is the key paint:
// actions, the Host tab, and live games. Orange fills always carry dark ink; orange *text* uses accentInk.
const light = {
  ground: '#F3F4F2', // screen background
  paper: '#FFFFFF', // cards and inputs
  line: '#E2E4DF', // hairlines and borders
  ink: '#1B1D1B', // primary text
  inkSoft: '#545A55', // secondary text
  inkFaint: '#6F756F', // captions and placeholders
  navy: '#1F3A5F', // times, selected chips, active tab
  onNavy: '#FFFFFF',
  accent: '#FF6B2C', // key paint: primary actions, score tile, Host tab
  onAccent: '#1B1D1B',
  accentInk: '#C2410C', // orange text on light grounds ("Live")
  navyTint: '#E4E9F0', // avatar background
  danger: '#B3261E', // errors only; live is never red
  dangerTint: '#FCE8E6',
  tabBar: '#FFFFFF',
  pressed: '#ECEDEA',
};

export type Palette = typeof light;

const dark: Palette = {
  ground: '#15171C',
  paper: '#1F2229',
  line: '#2E323B',
  ink: '#EDEAE3',
  inkSoft: '#B4B7BE',
  inkFaint: '#8E929A',
  navy: '#A9C1E3',
  onNavy: '#15171C',
  accent: '#FF6B2C',
  onAccent: '#15171C',
  accentInk: '#FFB27A',
  navyTint: '#26303F',
  danger: '#F2B8B5',
  dangerTint: '#3B1F1E',
  tabBar: '#111317',
  pressed: '#272B33',
};

export const palettes = { light, dark };

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

export function useIsDark(): boolean {
  return useColorScheme() === 'dark';
}

// Build a stylesheet for both appearances once, then pick per render. Usage:
//   const useStyles = createStyles((c) => ({ card: { backgroundColor: c.paper } }));
//   const styles = useStyles();
export function createStyles<T extends StyleSheet.NamedStyles<T>>(make: (c: Palette) => T) {
  const sheets = { light: StyleSheet.create(make(light)), dark: StyleSheet.create(make(dark)) };
  return function useStyles() {
    return useColorScheme() === 'dark' ? sheets.dark : sheets.light;
  };
}

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

// Nunito, loaded in the root layout. Weights are separate families, so never set fontWeight with these.
export const fonts = {
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

const tabular: TextStyle['fontVariant'] = ['tabular-nums'];

// The whole type scale. Rank comes from weight first, size second.
export const type = {
  display: { fontFamily: fonts.black, fontSize: 30, lineHeight: 35, letterSpacing: -0.3 },
  title: { fontFamily: fonts.extrabold, fontSize: 22, lineHeight: 28 },
  headline: { fontFamily: fonts.extrabold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 23 },
  meta: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19 },
  small: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16 },
  section: { fontFamily: fonts.black, fontSize: 13, lineHeight: 18, letterSpacing: 0.9 },
  score: { fontFamily: fonts.black, fontSize: 26, lineHeight: 30, fontVariant: tabular },
  scoreHuge: { fontFamily: fonts.black, fontSize: 56, lineHeight: 60, fontVariant: tabular },
  numeric: { fontVariant: tabular },
} satisfies Record<string, TextStyle>;
