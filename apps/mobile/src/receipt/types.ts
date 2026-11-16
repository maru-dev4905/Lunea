// The receipt is a look at one saved record (direction A, D-35). The metaphor is not final
// (D-12), so everything receipt-shaped stays inside src/receipt and app/receipt.
export type ReceiptItem = {
  label: string;
  // Synthetic for now. How a feeling gets a price is undecided (D-11); nothing computes it.
  price: number;
  // The user's own words, never the model's rewording (D-33).
  quote: string;
};

export type ReceiptData = {
  receiptNo: string;
  dateTime: string;
  event: string;
  items: ReceiptItem[];
  // Running total after today's deposit. Synthetic.
  balance: number;
  streakDays: number;
  thanks: string;
  note: string;
};
