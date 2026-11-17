// Decoration only: the bars are generated from a seed, not an encoding of anything, so the same
// receipt always draws the same barcode. Widths and gaps are small whole numbers of points.
export type BarcodeBar = { width: number; gap: number };

export function barcodeBars(count: number, seed: number): BarcodeBar[] {
  let state = Math.abs(Math.floor(seed)) % 233280;
  const next = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  return Array.from({ length: Math.max(count, 0) }, () => ({
    width: 1 + Math.floor(next() * 3),
    gap: 1 + Math.floor(next() * 3),
  }));
}
