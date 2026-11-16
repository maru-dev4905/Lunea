import { StyleSheet, Text, View } from 'react-native';

import { DrawLine } from '@/motion/DrawLine';
import { FadeIn } from '@/motion/FadeIn';
import { useTheme } from '@/theme';

import { Barcode } from './Barcode';
import { formatWon, sumPrices } from './format';
import { receiptSchedule } from './schedule';
import type { ReceiptData } from './types';

// "Today's receipt", laid out like a real one: store and date at the top, one row per feeling
// with its price on the right and a quote of the user's own words under it, a total, what was
// deposited, a streak, a barcode and a thank-you. The paper has no fill: its shape is told by
// a hairline, a soft shadow and the lines that draw themselves (D-36). Prices, balance and
// streak are synthetic until the owner decides how they are earned (D-11, D-12).
export function Receipt({ data }: { data: ReceiptData }) {
  const theme = useTheme();
  const schedule = receiptSchedule(data.items.length);
  const total = sumPrices(data.items);
  const ink = { color: theme.color.textPrimary };
  const soft = { color: theme.color.textSecondary };
  const muted = { color: theme.color.textMuted };

  return (
    <View style={[styles.paper, { borderColor: theme.color.borderSubtle }]}>
      <DrawLine delay={schedule.topLine} />

      <FadeIn delay={schedule.header} style={styles.header}>
        <Text style={[styles.brand, ink]}>LUNÉA</Text>
        <Text accessibilityRole="header" style={[styles.title, ink]}>
          오늘의 영수증
        </Text>
        <Text style={[styles.event, ink]}>{data.event}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, soft]}>{data.receiptNo}</Text>
          <Text style={[styles.meta, soft]}>{data.dateTime}</Text>
        </View>
      </FadeIn>

      <DrawLine variant="dashed" delay={schedule.columns - 150} style={styles.gap} />
      <FadeIn delay={schedule.columns} style={styles.row}>
        <Text style={[styles.columnHead, muted]}>품목</Text>
        <Text style={[styles.columnHead, muted]}>금액</Text>
      </FadeIn>

      {data.items.map((item, i) => (
        <View key={item.label} style={styles.item}>
          <FadeIn delay={schedule.items[i].row} style={styles.row}>
            <Text style={[styles.label, ink]}>{item.label}</Text>
            <Text style={[styles.price, ink]}>{formatWon(item.price)}</Text>
          </FadeIn>
          <FadeIn delay={schedule.items[i].quote} style={styles.quoteRow}>
            <Text style={[styles.quote, soft]}>“{item.quote}”</Text>
          </FadeIn>
        </View>
      ))}

      <DrawLine variant="dashed" delay={schedule.divider} style={styles.gap} />
      <FadeIn delay={schedule.total} style={styles.row}>
        <Text style={[styles.totalLabel, ink]}>합계</Text>
        <Text testID="receipt-total" style={[styles.totalPrice, ink]}>
          {formatWon(total)}
        </Text>
      </FadeIn>

      <FadeIn delay={schedule.deposit} style={styles.perks}>
        <View style={styles.perkRow}>
          <Text style={[styles.perk, soft]}>오늘 적립</Text>
          <Text testID="receipt-deposit" style={[styles.perk, styles.number, ink]}>
            {formatWon(total, { signed: true })}
          </Text>
        </View>
        <View style={styles.perkRow}>
          <Text style={[styles.perk, soft]}>누적</Text>
          <Text style={[styles.perk, styles.number, soft]}>{formatWon(data.balance)}</Text>
        </View>
      </FadeIn>

      <DrawLine variant="dashed" delay={schedule.streakLine} style={styles.gap} />
      <FadeIn delay={schedule.streak} style={styles.streak}>
        <Text style={[styles.perk, soft]}>연속 기록 {data.streakDays}일째</Text>
      </FadeIn>

      <View style={styles.barcode}>
        <Barcode delay={schedule.barcode} />
      </View>

      <FadeIn delay={schedule.footer} style={styles.footer}>
        <Text style={[styles.thanks, ink]}>{data.thanks}</Text>
        <Text style={[styles.note, muted]}>{data.note}</Text>
      </FadeIn>
      <DrawLine delay={schedule.footer + 200} />
    </View>
  );
}

const styles = StyleSheet.create({
  // No fill: hairline + soft shadow only. The shadow is a CSS-style outset box shadow, drawn
  // outside the box, so the transparent paper stays transparent.
  paper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    boxShadow: '0px 10px 36px rgba(21, 21, 21, 0.07)',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    gap: 6,
    alignItems: 'center',
  },
  brand: { fontSize: 12, letterSpacing: 5, fontWeight: '500' },
  title: { fontSize: 20, fontWeight: '300', letterSpacing: 1, marginTop: 4 },
  event: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 4 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginTop: 12,
  },
  meta: { fontSize: 11, letterSpacing: 0.5, fontVariant: ['tabular-nums'] },
  gap: { marginHorizontal: 24 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  columnHead: { fontSize: 11, letterSpacing: 1 },
  item: { paddingBottom: 4 },
  label: { fontSize: 16, fontWeight: '500' },
  price: { fontSize: 16, fontVariant: ['tabular-nums'] },
  quoteRow: { paddingHorizontal: 24, paddingTop: 2 },
  quote: { fontSize: 13, lineHeight: 19 },
  totalLabel: { fontSize: 18, fontWeight: '600' },
  totalPrice: { fontSize: 20, fontWeight: '600', fontVariant: ['tabular-nums'] },
  perks: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14, gap: 4 },
  perkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  perk: { fontSize: 13 },
  number: { fontVariant: ['tabular-nums'] },
  streak: { paddingHorizontal: 24, paddingVertical: 14, alignItems: 'center' },
  barcode: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 14 },
  footer: { paddingHorizontal: 24, paddingBottom: 22, gap: 6, alignItems: 'center' },
  thanks: { fontSize: 14, letterSpacing: 0.5 },
  note: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
