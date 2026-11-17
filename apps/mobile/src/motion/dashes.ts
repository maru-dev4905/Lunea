// How many dashes of a given length and gap fit in a width, so a dashed line can be drawn
// from small bars on every platform (dashed borders are unreliable on Android).
export function dashCount(width: number, dash: number, gap: number): number {
  if (width <= 0) return 0;
  return Math.max(Math.floor((width + gap) / (dash + gap)), 0);
}
