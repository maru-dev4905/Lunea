// When each part of the receipt starts, in ms: a line first, then the words under it, from top
// to bottom. A line takes `duration.draw` to finish, so the next part begins while it settles.
const HEADER_AT = 240;
const FIRST_ITEM_AT = 520;
const ITEM_STEP = 420;
const TEXT_AFTER_LINE = 200;

export type ReceiptSchedule = {
  topLine: number;
  header: number;
  items: { line: number; text: number }[];
  bottomLine: number;
  footer: number;
};

export function receiptSchedule(itemCount: number): ReceiptSchedule {
  const items = Array.from({ length: Math.max(itemCount, 0) }, (_, i) => {
    const line = FIRST_ITEM_AT + i * ITEM_STEP;
    return { line, text: line + TEXT_AFTER_LINE };
  });
  const bottomLine = FIRST_ITEM_AT + items.length * ITEM_STEP;
  return { topLine: 0, header: HEADER_AT, items, bottomLine, footer: bottomLine + TEXT_AFTER_LINE };
}
