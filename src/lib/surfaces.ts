// The play area for each sport: what the banner and thumbnails are painted with.
// `ink` is the text color that stays readable on that surface in the light theme.
export type Surface = {
  noun: string; // "soccer" in "One soccer game near you"
  base: string;
  alt: string; // second tone: planks, mowing stripes
  ink: string;
};

const SURFACES: Record<string, Surface> = {
  basketball: { noun: 'basketball', base: '#E3BD86', alt: '#DCB37B', ink: '#1F3A5F' },
  soccer: { noun: 'soccer', base: '#3A7449', alt: '#356C44', ink: '#FFFFFF' },
  tennis: { noun: 'tennis', base: '#3B7A57', alt: '#2F6E9E', ink: '#FFFFFF' },
  football: { noun: 'football', base: '#2F6B3F', alt: '#2B6339', ink: '#FFFFFF' },
  baseball: { noun: 'baseball', base: '#3D7A46', alt: '#B5653A', ink: '#FFFFFF' },
  other: { noun: 'pickup', base: '#4A4F57', alt: '#454A52', ink: '#FFFFFF' },
};

export const PAINT = '#FFFFFF'; // line markings
export const DUSK_INK = '#FFF4E6'; // text on any surface in the dark theme

export function surfaceFor(sport: string): Surface {
  return SURFACES[sport] ?? SURFACES.other;
}
