import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { isSubmittable, useDraft } from '@/journal';
import { FadeIn } from '@/motion/FadeIn';
import { useTheme } from '@/theme';

// docs/03 Today: a clear way in, nothing mandatory, no streaks, scores or guilt copy.
// The parts settle in one after another (D-34); with reduced motion they are simply there.
export default function TodayScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { draft } = useDraft();
  const hasDraft = isSubmittable(draft);

  return (
    <View style={[styles.container, { backgroundColor: theme.color.background }]}>
      <FadeIn>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.color.textPrimary }]}>
          Today
        </Text>
      </FadeIn>
      <FadeIn delay={90}>
        <Text style={[styles.lead, { color: theme.color.textSecondary }]}>
          지금 떠오르는 대로 적어 봐도 좋아요. 쓰지 않아도 괜찮아요.
        </Text>
      </FadeIn>
      <FadeIn delay={180}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/journal/new')}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.color.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.buttonLabel, { color: theme.color.onAccent }]}>
            {hasDraft ? '이어서 쓰기' : '오늘 기록 시작'}
          </Text>
        </Pressable>
      </FadeIn>
      <FadeIn delay={270}>
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/receipt/sample')}
          style={({ pressed }) => [styles.link, pressed && { opacity: 0.6 }]}
        >
          <Text style={[styles.linkLabel, { color: theme.color.textSecondary }]}>
            영수증 예시 보기
          </Text>
        </Pressable>
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 22, fontWeight: '300', letterSpacing: 0.5 },
  lead: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  button: { minHeight: 48, paddingHorizontal: 24, borderRadius: 999, justifyContent: 'center' },
  buttonLabel: { fontSize: 16, fontWeight: '500' },
  link: { minHeight: 44, justifyContent: 'center' },
  linkLabel: { fontSize: 14, letterSpacing: 0.5 },
});
