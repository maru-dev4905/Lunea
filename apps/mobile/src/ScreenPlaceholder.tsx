import { StyleSheet, Text, View } from 'react-native';

import { FadeIn } from '@/motion/FadeIn';
import { useTheme } from '@/theme';

// Skeleton only: real screens come with their own tickets. Navigation (IA) is a proposal.
export function ScreenPlaceholder({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.color.background }]}>
      <FadeIn>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.color.textPrimary }]}>
          {title}
        </Text>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '300', letterSpacing: 0.5 },
});
