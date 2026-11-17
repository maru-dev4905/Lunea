// The tab indicator is a short bar centered under the active tab.
export type PillFrame = { left: number; width: number };

export function pillFrame(args: {
  index: number;
  count: number;
  barWidth: number;
  pillLength: number;
}): PillFrame {
  const { index, count, barWidth, pillLength } = args;
  if (barWidth <= 0 || count <= 0) return { left: 0, width: 0 };
  const width = Math.min(pillLength, barWidth);
  const center = ((index + 0.5) * barWidth) / count;
  const left = Math.min(Math.max(center - width / 2, 0), barWidth - width);
  return { left, width };
}
