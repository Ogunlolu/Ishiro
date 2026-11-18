import { StyleSheet, Text, type TextProps } from 'react-native';

import { fonts, fontSize } from './tokens';
import { useTheme } from './use-theme';

/** The lowercase "ishiro" wordmark. */
export function Wordmark() {
  const theme = useTheme();
  return (
    <Text accessibilityRole="header" style={[styles.wordmark, { color: theme.ink }]}>
      ishiro
    </Text>
  );
}

/** Screen headline, in the display font. */
export function Headline({ style, ...props }: TextProps) {
  const theme = useTheme();
  return (
    <Text accessibilityRole="header" style={[styles.headline, { color: theme.ink }, style]} {...props} />
  );
}

/** Body text, in the phone's system font. */
export function Body({ style, ...props }: TextProps) {
  const theme = useTheme();
  return <Text style={[styles.body, { color: theme.secondary }, style]} {...props} />;
}

const styles = StyleSheet.create({
  wordmark: {
    fontFamily: fonts.displayExtraBold,
    fontSize: fontSize.wordmark,
  },
  headline: {
    fontFamily: fonts.displayBold,
    fontSize: fontSize.headline,
  },
  body: {
    fontSize: fontSize.body,
    lineHeight: 24,
  },
});
