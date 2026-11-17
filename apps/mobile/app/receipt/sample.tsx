import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Receipt } from '@/receipt/Receipt';
import { SAMPLE_RECEIPT } from '@/receipt/sample';
import { useTheme } from '@/theme';

// Prototype of the receipt on synthetic data (LUN-35). Not linked to any saved record yet.
export default function ReceiptSampleScreen() {
  const theme = useTheme();
  const router = useRouter();
  // On the web this can be the first screen, so there may be nothing to go back to.
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.color.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={close}
          style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}
        >
          <Text style={[styles.closeLabel, { color: theme.color.textSecondary }]}>닫기</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Receipt data={SAMPLE_RECEIPT} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16 },
  close: { minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center' },
  closeLabel: { fontSize: 16 },
  content: { padding: 24, paddingBottom: 48 },
});
