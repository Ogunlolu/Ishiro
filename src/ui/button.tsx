import { Pressable, StyleSheet, Text } from 'react-native';

import { fontSize, minTouchTarget, radius, spacing } from './tokens';
import { useTheme } from './use-theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
}

/** The one main action on a screen: Guava with Ink text. */
export function Button({ label, onPress }: ButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.guava, opacity: pressed ? 0.85 : 1 },
      ]}>
      <Text style={[styles.label, { color: theme.onGuava }]}>{label}</Text>
    </Pressable>
  );
}

export const buttonMinHeight = 56;

const styles = StyleSheet.create({
  button: {
    minHeight: Math.max(buttonMinHeight, minTouchTarget),
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: '700',
  },
});
