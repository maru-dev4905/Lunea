// Won amounts for the receipt. Plain arithmetic only: the receipt adds up the prices it is
// given. How a feeling gets a price is undecided (D-11), so no function maps feelings to money.
export function formatWon(amount: number, options: { signed?: boolean } = {}): string {
  const rounded = Math.round(amount);
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = rounded < 0 ? '-' : options.signed && rounded > 0 ? '+' : '';
  return `${sign}${digits}원`;
}

export function sumPrices(items: readonly { price: number }[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}
