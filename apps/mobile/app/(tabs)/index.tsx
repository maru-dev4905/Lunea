import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { isSubmittable, useDraft } from '@/journal';
import { useTheme } from '@/theme';

// docs/03 Today: a clear way in, nothing mandatory, no streaks, scores or guilt copy.
export default function TodayScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { draft } = useDraft();
  const hasDraft = isSubmittable(draft);

  return (
    <View style={[styles.container, { backgroundColor: theme.color.background }]}>
      <Text accessibilityRole="header" style={[styles.title, { color: theme.color.textPrimary }]}>
        Today
      </Text>
      <Text style={[styles.lead, { color: theme.color.textSecondary }]}>
        지금 떠오르는 대로 적어 봐도 좋아요. 쓰지 않아도 괜찮아요.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/journal/new')}
        style={[styles.button, { backgroundColor: theme.color.accent }]}
      >
        <Text style={styles.buttonLabel}>{hasDraft ? '이어서 쓰기' : '오늘 기록 시작'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 22, fontWeight: '600' },
  lead: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  button: { minHeight: 48, paddingHorizontal: 24, borderRadius: 12, justifyContent: 'center' },
  buttonLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
