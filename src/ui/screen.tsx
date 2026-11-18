import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { spacing } from './tokens';
import { useTheme } from './use-theme';

interface ScreenProps {
  children: ReactNode;
  /**
   * Set when the screen sits under a navigation header, which already keeps
   * clear of the top of the phone.
   */
  hasHeader?: boolean;
}

const allEdges: Edge[] = ['top', 'bottom', 'left', 'right'];
const belowHeaderEdges: Edge[] = ['bottom', 'left', 'right'];

/**
 * Page background and safe-area padding shared by every screen. Content
 * scrolls when it does not fit, so large system text is never cut off.
 */
export function Screen({ children, hasHeader = false }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView
      edges={hasHeader ? belowHeaderEdges : allEdges}
      style={[styles.safeArea, { backgroundColor: theme.paper }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
