import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Body, Wordmark } from './text';
import { palettes, type ColorScheme } from './tokens';

let mockScheme: ColorScheme = 'light';
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockScheme,
}));

describe.each<ColorScheme>(['light', 'dark'])('text in %s mode', (scheme) => {
  beforeEach(() => {
    mockScheme = scheme;
  });

  it('draws the wordmark in that scheme\'s Ink', async () => {
    await render(<Wordmark />);
    const style = StyleSheet.flatten(screen.getByText('ishiro').props.style);
    expect(style.color).toBe(palettes[scheme].ink);
  });

  it('draws body text in that scheme\'s secondary colour', async () => {
    await render(<Body>hello</Body>);
    const style = StyleSheet.flatten(screen.getByText('hello').props.style);
    expect(style.color).toBe(palettes[scheme].secondary);
  });
});

it('uses different Ink in light and dark', () => {
  expect(palettes.light.ink).not.toBe(palettes.dark.ink);
});
