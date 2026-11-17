import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme';

// The way into the receipt prototype. It lives here so the Today screen never has to know the
// receipt's wording or route (D-12): replacing the metaphor only touches src/receipt and app/receipt.
export function ReceiptLink() {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => router.push('/receipt/sample')}
      style={({ pressed }) => [styles.link, pressed && { opacity: 0.6 }]}
    >
      <Text style={[styles.label, { color: theme.color.textSecondary }]}>영수증 예시 보기</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { minHeight: 44, justifyContent: 'center' },
  label: { fontSize: 14, letterSpacing: 0.5 },
});
