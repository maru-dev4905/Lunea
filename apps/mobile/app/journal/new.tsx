import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isSubmittable, useDraft } from '@/journal';
import { useTheme } from '@/theme';

// docs/03 Journal editor: write first, no emotion picker, draft kept on leaving.
export default function JournalEditorScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { draft, setDraft } = useDraft();
  const [notice, setNotice] = useState<string | null>(null);
  const canSave = isSubmittable(draft);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.color.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.close}>
            <Text style={[styles.closeLabel, { color: theme.color.textSecondary }]}>닫기</Text>
          </Pressable>
        </View>

        <Text
          style={[
            styles.notice,
            { color: theme.color.textSecondary, backgroundColor: theme.color.surface },
          ]}
        >
          지금은 임시 저장이라 앱을 끄면 사라져요. 실제 일기는 아직 쓰지 마세요.
        </Text>

        <TextInput
          accessibilityLabel="일기 입력"
          multiline
          textAlignVertical="top"
          placeholder="오늘은 어땠나요?"
          placeholderTextColor={theme.color.textSecondary}
          value={draft}
          onChangeText={(text) => {
            setDraft(text);
            setNotice(null);
          }}
          style={[
            styles.input,
            { color: theme.color.textPrimary, borderColor: theme.color.borderSubtle },
          ]}
        />

        {notice ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.feedback, { color: theme.color.textSecondary }]}
          >
            {notice}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={!canSave}
          onPress={() => setNotice('저장 기능은 다음 업데이트에서 추가돼요.')}
          style={[
            styles.save,
            { backgroundColor: canSave ? theme.color.accent : theme.color.borderSubtle },
          ]}
        >
          <Text
            style={[styles.saveLabel, { color: canSave ? '#FFFFFF' : theme.color.textSecondary }]}
          >
            저장
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'flex-end' },
  close: { minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center' },
  closeLabel: { fontSize: 16 },
  notice: { fontSize: 14, lineHeight: 20, padding: 12, borderRadius: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 17, lineHeight: 26 },
  feedback: { fontSize: 14, lineHeight: 20 },
  save: { minHeight: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  saveLabel: { fontSize: 16, fontWeight: '600' },
});
