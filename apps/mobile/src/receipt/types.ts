// The receipt is a look at one saved record (direction A, D-35). The metaphor is not final
// (D-12), so everything receipt-shaped stays inside src/receipt and app/receipt.
export type ReceiptItem = {
  label: string;
  // The user's own words, never the model's rewording (D-33).
  quote: string;
};

export type ReceiptData = {
  dateLabel: string;
  event: string;
  items: ReceiptItem[];
  note: string;
};
