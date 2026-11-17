import { dashCount } from '@/motion/dashes';
import { barcodeBars } from '@/receipt/barcodeBars';

describe('dashCount', () => {
  it.each([
    [0, 0],
    [3, 0],
    [4, 1],
    [8, 1],
    [12, 2],
    [80, 10],
    [100, 13],
  ])('fits %i px with %i dashes (dash 4, gap 4)', (width, count) => {
    expect(dashCount(width, 4, 4)).toBe(count);
  });

  it('never returns a negative or fractional count', () => {
    expect(dashCount(-20, 4, 4)).toBe(0);
    expect(Number.isInteger(dashCount(101.7, 4, 4))).toBe(true);
  });
});

// The barcode is decoration. It is generated, not encoded, so the same receipt always draws
// the same bars.
describe('barcodeBars', () => {
  it('returns the requested number of bars', () => {
    expect(barcodeBars(40, 7)).toHaveLength(40);
    expect(barcodeBars(0, 7)).toHaveLength(0);
  });

  it('is deterministic for the same seed', () => {
    expect(barcodeBars(40, 7)).toEqual(barcodeBars(40, 7));
  });

  it('differs between seeds', () => {
    expect(barcodeBars(40, 7)).not.toEqual(barcodeBars(40, 8));
  });

  it('keeps every bar thin and every gap small, with some variety', () => {
    const bars = barcodeBars(60, 3);
    bars.forEach(({ width, gap }) => {
      expect(width).toBeGreaterThanOrEqual(1);
      expect(width).toBeLessThanOrEqual(3);
      expect(gap).toBeGreaterThanOrEqual(1);
      expect(gap).toBeLessThanOrEqual(3);
    });
    expect(new Set(bars.map((b) => b.width)).size).toBeGreaterThan(1);
  });
});
