import { receiptSchedule } from '@/receipt/schedule';

// The receipt draws itself top to bottom: each line first, then what sits under it.
describe('receiptSchedule', () => {
  const schedule = receiptSchedule(3);

  const times = (s = schedule) => [
    s.topLine,
    s.header,
    s.columns,
    ...s.items.flatMap((i) => [i.row, i.quote]),
    s.divider,
    s.total,
    s.deposit,
    s.streakLine,
    s.streak,
    s.barcode,
    s.footer,
  ];

  it('starts with the top line and keeps everything moving forward, never at the same moment', () => {
    expect(schedule.topLine).toBe(0);
    expect(times()).toEqual([...times()].sort((a, b) => a - b));
    expect(new Set(times()).size).toBe(times().length);
  });

  it('shows each quote after its own row', () => {
    schedule.items.forEach((item) => expect(item.quote).toBeGreaterThan(item.row));
  });

  it('has one slot per item and stays ordered for other sizes', () => {
    expect(receiptSchedule(0).items).toHaveLength(0);
    expect(receiptSchedule(5).items).toHaveLength(5);
    const five = receiptSchedule(5);
    expect(times(five)).toEqual([...times(five)].sort((a, b) => a - b));
  });

  it('keeps the whole sequence unhurried but not endless', () => {
    expect(receiptSchedule(3).footer).toBeLessThanOrEqual(4500);
  });
});
