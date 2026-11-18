import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/ui/button';
import { Screen } from '@/ui/screen';
import { Body, Headline, Wordmark } from '@/ui/text';
import { spacing } from '@/ui/tokens';

/** Home: the list of trips. Empty for now. */
export default function HomeScreen() {
  const router = useRouter();
  return (
    <Screen>
      <Wordmark />
      <View style={styles.empty}>
        <Headline>No trips yet.</Headline>
        <Body>Start one, then add the first thing someone paid for.</Body>
      </View>
      <Button label="Start a trip" onPress={() => router.push('/new-trip')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
