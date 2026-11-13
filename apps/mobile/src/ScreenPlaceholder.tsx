import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

// Skeleton only: real screens come with UX-01. Navigation (IA) is a proposal, not final.
export function ScreenPlaceholder({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.color.background }]}>
      <Text accessibilityRole="header" style={[styles.title, { color: theme.color.textPrimary }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '600' },
});
