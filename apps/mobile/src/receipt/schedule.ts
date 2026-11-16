// When each part of the receipt starts, in ms, from top to bottom: a line first, then what sits
// under it. A line takes `duration.draw` to finish, so the next part begins while it settles.
const HEADER_AT = 300;
const COLUMNS_AT = 600;
const FIRST_ITEM_AT = 900;
const ITEM_STEP = 450;
const QUOTE_AFTER_ROW = 220;
const BLOCK_STEP = 300;

export type ReceiptSchedule = {
  topLine: number;
  header: number;
  columns: number;
  items: { row: number; quote: number }[];
  divider: number;
  total: number;
  deposit: number;
  streakLine: number;
  streak: number;
  barcode: number;
  footer: number;
};

export function receiptSchedule(itemCount: number): ReceiptSchedule {
  const items = Array.from({ length: Math.max(itemCount, 0) }, (_, i) => {
    const row = FIRST_ITEM_AT + i * ITEM_STEP;
    return { row, quote: row + QUOTE_AFTER_ROW };
  });
  const divider = FIRST_ITEM_AT + items.length * ITEM_STEP;
  const total = divider + BLOCK_STEP + 50;
  const deposit = total + BLOCK_STEP;
  const streakLine = deposit + BLOCK_STEP;
  const streak = streakLine + QUOTE_AFTER_ROW;
  const barcode = streak + BLOCK_STEP + 50;
  const footer = barcode + 400;
  return {
    topLine: 0,
    header: HEADER_AT,
    columns: COLUMNS_AT,
    items,
    divider,
    total,
    deposit,
    streakLine,
    streak,
    barcode,
    footer,
  };
}
