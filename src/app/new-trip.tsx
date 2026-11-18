import { StyleSheet, View } from 'react-native';

import { Screen } from '@/ui/screen';
import { Body, Headline } from '@/ui/text';
import { spacing } from '@/ui/tokens';

/** Placeholder: creating a trip is the next slice to build. */
export default function NewTripScreen() {
  return (
    <Screen hasHeader>
      <View style={styles.content}>
        <Headline>New trip</Headline>
        <Body>Nothing here yet. Creating a trip is next to be built.</Body>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },
});
