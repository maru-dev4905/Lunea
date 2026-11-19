import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatRecordDate, useRecords } from '@/journal';
import { DrawLine } from '@/motion/DrawLine';
import { FadeIn } from '@/motion/FadeIn';
import { useTheme } from '@/theme';

const SAVED = '저장했어요.';

// docs/03a Detail (no AI, no emotions yet). The original text is shown exactly as written.
// Arriving right after a save (`saved=1`) also shows one calm line; there are no points,
// streaks or praise (docs/03a Save feedback). Edit and delete are out of scope (D-30, D-31).
export default function RecordDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id, saved } = useLocalSearchParams<{ id: string; saved?: string }>();
  const { records } = useRecords();
  const record = records.find((r) => r.id === id);
  const justSaved = saved === '1' && record !== undefined;

  useEffect(() => {
    // accessibilityLiveRegion is Android only; this reaches VoiceOver on iOS as well.
    if (justSaved) AccessibilityInfo.announceForAccessibility(SAVED);
  }, [justSaved]);

  // On the web the detail can be the first screen, so there may be nothing to go back to.
  const back = () => (router.canGoBack() ? router.back() : router.replace('/collection'));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.color.background }]}>
      <FadeIn style={styles.fill}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로"
            onPress={back}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
          >
            <Text style={[styles.backLabel, { color: theme.color.textSecondary }]}>뒤로</Text>
          </Pressable>
        </View>
        {record ? (
          <ScrollView contentContainerStyle={styles.body}>
            {justSaved ? (
              <View style={styles.saved}>
                <Text
                  accessibilityLiveRegion="polite"
                  style={[styles.savedLabel, { color: theme.color.textSecondary }]}
                >
                  {SAVED}
                </Text>
                <DrawLine />
              </View>
            ) : null}
            <Text
              accessibilityRole="header"
              style={[styles.date, { color: theme.color.textPrimary }]}
            >
              {formatRecordDate(record.createdAt)}
            </Text>
            <Text style={[styles.heading, { color: theme.color.textSecondary }]}>원문</Text>
            <Text
              testID="record-text"
              selectable
              style={[
                styles.text,
                { color: theme.color.textPrimary, borderColor: theme.color.borderSubtle },
              ]}
            >
              {record.text}
            </Text>
          </ScrollView>
        ) : (
          <View style={styles.missing}>
            <Text style={[styles.missingText, { color: theme.color.textSecondary }]}>
              이 기록을 찾을 수 없어요.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/collection')}
              style={({ pressed }) => [
                styles.button,
                { borderColor: theme.color.accent, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.buttonLabel, { color: theme.color.accent }]}>
                Collection으로
              </Text>
            </Pressable>
          </View>
        )}
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fill: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 16 },
  back: { minHeight: 44, minWidth: 44, justifyContent: 'center' },
  backLabel: { fontSize: 16 },
  body: { padding: 16, gap: 12 },
  saved: { gap: 8, marginBottom: 8 },
  savedLabel: { fontSize: 15, lineHeight: 22 },
  date: { fontSize: 20, fontWeight: '300', letterSpacing: 0.3 },
  heading: { fontSize: 14, marginTop: 8 },
  // A hairline frame, not a fill (D-36).
  text: {
    fontSize: 17,
    lineHeight: 26,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  missingText: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  button: {
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
  },
  buttonLabel: { fontSize: 16, fontWeight: '500' },
});
