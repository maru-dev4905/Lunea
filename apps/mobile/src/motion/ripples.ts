// A touch sends out a few rings; only the newest few touches stay alive at once, so quick
// repeated touches can never pile up animations.
export type Ripple = { id: number; x: number; y: number };

export const MAX_RIPPLES = 4;
export const RINGS_PER_RIPPLE = 3;

export function addRipple(list: readonly Ripple[], next: Ripple, max: number): Ripple[] {
  return [...list, next].slice(-max);
}

export function ringDelays(count: number, stagger: number): number[] {
  return Array.from({ length: Math.max(count, 0) }, (_, i) => i * stagger);
}
