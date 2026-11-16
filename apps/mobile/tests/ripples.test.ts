import { addRipple, ringDelays, type Ripple } from '@/motion/ripples';

const ripple = (id: number): Ripple => ({ id, x: 10 * id, y: 5 * id });

// A touch spawns a few rings; only the newest few touches stay alive.
describe('addRipple', () => {
  it('adds the new ripple at the end', () => {
    expect(addRipple([ripple(1)], ripple(2), 4)).toEqual([ripple(1), ripple(2)]);
  });

  it('drops the oldest ripples beyond the limit', () => {
    const full = [ripple(1), ripple(2), ripple(3)];
    expect(addRipple(full, ripple(4), 3).map((r) => r.id)).toEqual([2, 3, 4]);
  });

  it('does not change the list it was given', () => {
    const list = [ripple(1)];
    addRipple(list, ripple(2), 4);
    expect(list).toEqual([ripple(1)]);
  });
});

describe('ringDelays', () => {
  it('spreads the rings of one touch evenly in time', () => {
    expect(ringDelays(3, 140)).toEqual([0, 140, 280]);
  });

  it('returns nothing for zero rings', () => {
    expect(ringDelays(0, 140)).toEqual([]);
  });
});
