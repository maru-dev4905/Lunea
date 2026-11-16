import { pillFrame } from '@/motion/pillFrame';

// The indicator is a short bar centered under the active tab.
describe('pillFrame', () => {
  it('centers the pill under each of three equal tabs', () => {
    const args = { count: 3, barWidth: 300, pillLength: 28 };
    expect(pillFrame({ ...args, index: 0 })).toEqual({ left: 36, width: 28 });
    expect(pillFrame({ ...args, index: 1 })).toEqual({ left: 136, width: 28 });
    expect(pillFrame({ ...args, index: 2 })).toEqual({ left: 236, width: 28 });
  });

  it('never leaves the bar', () => {
    const { left, width } = pillFrame({ index: 0, count: 3, barWidth: 30, pillLength: 28 });
    expect(left).toBeGreaterThanOrEqual(0);
    expect(left + width).toBeLessThanOrEqual(30);
  });

  it('returns an empty frame before the bar has been measured', () => {
    expect(pillFrame({ index: 1, count: 3, barWidth: 0, pillLength: 28 })).toEqual({
      left: 0,
      width: 0,
    });
  });
});
