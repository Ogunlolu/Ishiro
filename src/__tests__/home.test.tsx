import { fireEvent, render, screen } from '@testing-library/react-native';

import HomeScreen from '@/app/index';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Home screen', () => {
  beforeEach(() => mockPush.mockClear());

  it('shows the wordmark and the empty state', async () => {
    await render(<HomeScreen />);
    expect(screen.getByText('ishiro')).toBeTruthy();
    expect(screen.getByText('No trips yet.')).toBeTruthy();
  });

  it('has exactly one button, and it opens the new trip screen', async () => {
    await render(<HomeScreen />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    await fireEvent.press(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith('/new-trip');
  });
});
