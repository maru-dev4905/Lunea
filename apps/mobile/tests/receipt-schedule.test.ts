import { receiptSchedule } from '@/receipt/schedule';

// The receipt draws itself top to bottom: each line first, then the words under it.
describe('receiptSchedule', () => {
  const schedule = receiptSchedule(3);

  it('starts with the top line and keeps everything moving forward', () => {
    expect(schedule.topLine).toBe(0);
    expect(schedule.header).toBeGreaterThan(schedule.topLine);
    const times = [
      schedule.header,
      ...schedule.items.flatMap((i) => [i.line, i.text]),
      schedule.bottomLine,
      schedule.footer,
    ];
    expect(times).toEqual([...times].sort((a, b) => a - b));
    expect(new Set(times).size).toBe(times.length);
  });

  it('shows each item after the line above it', () => {
    schedule.items.forEach((item) => expect(item.text).toBeGreaterThan(item.line));
  });

  it('has one slot per item', () => {
    expect(receiptSchedule(0).items).toHaveLength(0);
    expect(receiptSchedule(5).items).toHaveLength(5);
  });

  it('keeps the whole sequence short enough to feel calm, not slow', () => {
    expect(receiptSchedule(3).footer).toBeLessThanOrEqual(2500);
  });
});
