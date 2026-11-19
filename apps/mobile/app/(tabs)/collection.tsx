import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatRecordDate, useRecords } from '@/journal';
import { FadeIn } from '@/motion/FadeIn';
import { useTheme } from '@/theme';

// docs/03a Collection: a plain, newest-first list with a short preview of the original text.
// No totals, trends, charts or look-back here. Several records on one day are separate items
// (grouping by day is D-14, TBD).
export default function CollectionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { records } = useRecords();

  return (
    <View style={[styles.container, { backgroundColor: theme.color.background }]}>
      <FadeIn>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.color.textPrimary }]}>
          Collection
        </Text>
      </FadeIn>
      {records.length === 0 ? (
        <FadeIn delay={theme.motion.stagger} style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.color.textSecondary }]}>
            저장한 기록이 여기에 모여요.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/journal/new')}
            style={({ pressed }) => [
              styles.button,
              { borderColor: theme.color.accent, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={[styles.buttonLabel, { color: theme.color.accent }]}>기록 쓰기</Text>
          </Pressable>
        </FadeIn>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={records}
          keyExtractor={(record) => record.id}
          ListHeaderComponent={
            <Text style={[styles.note, { color: theme.color.textSecondary }]}>
              지금은 임시 저장이라 앱을 끄면 사라져요.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityHint="기록을 엽니다"
              onPress={() => router.push({ pathname: '/record/[id]', params: { id: item.id } })}
              style={({ pressed }) => [
                styles.item,
                { borderColor: theme.color.borderSubtle, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={[styles.date, { color: theme.color.textSecondary }]}>
                {formatRecordDate(item.createdAt)}
              </Text>
              {/* Only the look is shortened; the stored text is whole. */}
              <Text numberOfLines={3} style={[styles.preview, { color: theme.color.textPrimary }]}>
                {item.text}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '300', letterSpacing: 0.5, textAlign: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 24 },
  emptyText: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  list: { flex: 1, marginTop: 16 },
  listContent: { gap: 12, paddingBottom: 24 },
  note: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  // A hairline frame, not a fill (D-36).
  item: {
    minHeight: 48,
    padding: 16,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
  date: { fontSize: 14 },
  preview: { fontSize: 16, lineHeight: 24 },
  button: {
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
  },
  buttonLabel: { fontSize: 16, fontWeight: '500' },
});
