/**
 * Design tokens: the only place colours, type and spacing are defined.
 * Source of truth for the values is docs/brand.md.
 */

export type ColorScheme = 'light' | 'dark';

export interface Palette {
  /** Screen background. */
  paper: string;
  /** Main text and numbers. */
  ink: string;
  /** Secondary text. */
  secondary: string;
  /** Thin lines between list rows. */
  divider: string;
  /** The single main action per screen, and celebrations. */
  guava: string;
  /** Text on Guava. Always Ink, in both schemes. */
  onGuava: string;
}

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    paper: '#FFFFFF',
    ink: '#111111',
    secondary: '#555555',
    divider: '#E5E5E5',
    guava: '#FF4F8B',
    onGuava: '#111111',
  },
  // docs/brand.md does not define dark values yet; these are a proposal.
  dark: {
    paper: '#111111',
    ink: '#FFFFFF',
    secondary: '#A8A8A8',
    divider: '#2E2E2E',
    guava: '#FF4F8B',
    onGuava: '#111111',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  button: 16,
} as const;

/** Bricolage Grotesque faces, loaded in src/app/_layout.tsx. */
export const fonts = {
  displayBold: 'BricolageGrotesque_700Bold',
  displayExtraBold: 'BricolageGrotesque_800ExtraBold',
} as const;

export const fontSize = {
  body: 17,
  label: 17,
  headline: 28,
  wordmark: 40,
} as const;

/** Smallest allowed touch target, in points (accessibility baseline). */
export const minTouchTarget = 44;
