// One place to re-skin the app. The palette is small on purpose:
// neutrals for structure, blue for people and actions, red only for "live".
export const colors = {
  ground: '#F3F4F2', // screen background
  paper: '#FFFFFF', // cards and inputs
  line: '#E1E3DE', // hairlines and borders
  ink: '#1B1D1B', // primary text
  inkSoft: '#5B615C', // secondary text
  inkFaint: '#8A908B', // captions and placeholders
  accent: '#1D5FA8', // buttons and the active tab
  accentTint: '#E6F1FB', // avatar background
  accentInk: '#0C447C', // text on accentTint
  live: '#B3261E', // the "Live" label
  liveDot: '#E24B4A', // the dot beside it
} as const;

export const radius = { sm: 8, md: 12 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const fontSize = { title: 20, body: 15, meta: 13, small: 12 } as const;
