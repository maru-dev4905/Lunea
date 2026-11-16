import { StyleSheet, Text, View } from 'react-native';

import { DrawLine } from '@/motion/DrawLine';
import { FadeIn } from '@/motion/FadeIn';
import { RippleSurface } from '@/motion/RippleSurface';
import { useTheme } from '@/theme';

import { receiptSchedule } from './schedule';
import type { ReceiptData } from './types';

// "Today's receipt": lines draw themselves from top to bottom and the words settle in under
// each one. Touching the paper sends a ripple across it. No prices, scores or streaks.
export function Receipt({ data }: { data: ReceiptData }) {
  const theme = useTheme();
  const schedule = receiptSchedule(data.items.length);

  return (
    <RippleSurface
      testID="receipt"
      style={[
        styles.paper,
        { backgroundColor: theme.color.surfaceElevated, borderColor: theme.color.borderSubtle },
      ]}
    >
      <DrawLine delay={schedule.topLine} />
      <FadeIn delay={schedule.header} style={styles.header}>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.color.textPrimary }]}>
          오늘의 영수증
        </Text>
        <Text style={[styles.meta, { color: theme.color.textSecondary }]}>{data.dateLabel}</Text>
        <Text style={[styles.event, { color: theme.color.textPrimary }]}>{data.event}</Text>
      </FadeIn>

      {data.items.map((item, i) => (
        <View key={item.label}>
          <DrawLine delay={schedule.items[i].line} />
          <FadeIn delay={schedule.items[i].text} style={styles.row}>
            <Text style={[styles.label, { color: theme.color.textPrimary }]}>{item.label}</Text>
            <Text style={[styles.quote, { color: theme.color.textSecondary }]}>“{item.quote}”</Text>
          </FadeIn>
        </View>
      ))}

      <DrawLine delay={schedule.bottomLine} />
      <FadeIn delay={schedule.footer} style={styles.footer}>
        <Text style={[styles.note, { color: theme.color.textMuted }]}>{data.note}</Text>
      </FadeIn>
    </RippleSurface>
  );
}

const styles = StyleSheet.create({
  paper: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 4, paddingBottom: 8 },
  header: { paddingHorizontal: 24, paddingVertical: 24, gap: 6, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '300', letterSpacing: 1 },
  meta: { fontSize: 13, letterSpacing: 1 },
  event: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8 },
  row: { paddingHorizontal: 24, paddingVertical: 16, gap: 4 },
  label: { fontSize: 16, fontWeight: '500' },
  quote: { fontSize: 14, lineHeight: 21 },
  footer: { paddingHorizontal: 24, paddingVertical: 16, alignItems: 'center' },
  note: { fontSize: 12, letterSpacing: 0.5 },
});
