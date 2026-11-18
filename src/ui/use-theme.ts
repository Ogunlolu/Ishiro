import { useColorScheme } from 'react-native';

import { palettes, type Palette } from './tokens';

/** The palette for the phone's current light or dark setting. */
export function useTheme(): Palette {
  return useColorScheme() === 'dark' ? palettes.dark : palettes.light;
}
