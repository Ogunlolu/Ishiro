import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Button } from './button';
import { palettes, type ColorScheme } from './tokens';

let mockScheme: ColorScheme = 'light';
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockScheme,
}));

describe.each<ColorScheme>(['light', 'dark'])('Button in %s mode', (scheme) => {
  beforeEach(() => {
    mockScheme = scheme;
  });

  it('is Guava with Ink text', async () => {
    await render(<Button label="Start a trip" onPress={() => {}} />);
    const button = StyleSheet.flatten(screen.getByTestId('button').props.style);
    const label = StyleSheet.flatten(screen.getByTestId('button-label').props.style);
    expect(button.backgroundColor).toBe('#FF4F8B');
    expect(label.color).toBe('#111111');
    expect(button.backgroundColor).toBe(palettes[scheme].guava);
  });

  it('is at least 44 points tall', async () => {
    await render(<Button label="Start a trip" onPress={() => {}} />);
    const button = StyleSheet.flatten(screen.getByTestId('button').props.style);
    expect(button.minHeight).toBeGreaterThanOrEqual(44);
  });
});

it('calls onPress when tapped', async () => {
  const onPress = jest.fn();
  await render(<Button label="Go" onPress={onPress} />);
  await fireEvent.press(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
