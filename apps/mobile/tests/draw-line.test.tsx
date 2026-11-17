import {
  fireEvent,
  isHiddenFromAccessibility,
  render,
  screen,
} from '@testing-library/react-native';
import { Animated } from 'react-native';

import { DrawLine } from '@/motion/DrawLine';
import { useReducedMotion } from '@/motion/useReducedMotion';

jest.mock('@/motion/useReducedMotion', () => ({ useReducedMotion: jest.fn() }));

// Decorative parts are hidden from screen readers on purpose, and Testing Library skips hidden
// elements unless asked. Without this a "no dashes" check would pass vacuously.
const hidden = { includeHiddenElements: true };
const layout = (width: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width, height: 1 } } });

describe('DrawLine', () => {
  it('is decorative: hidden from screen readers', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await render(<DrawLine testID="line" />);
    expect(isHiddenFromAccessibility(screen.getByTestId('line', hidden))).toBe(true);
  });

  it('is simply there when motion is reduced', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await render(<DrawLine testID="line" />);
    expect(screen.getByTestId('line', hidden)).toBeOnTheScreen();
  });

  it('draws no dashes for a solid line', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await render(<DrawLine testID="line" />);
    await fireEvent(screen.getByTestId('line', hidden), 'layout', layout(80));
    expect(screen.queryAllByTestId('dash', hidden)).toHaveLength(0);
  });

  it('fills a dashed line with as many dashes as fit once it has a width', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await render(<DrawLine testID="line" variant="dashed" />);
    expect(screen.queryAllByTestId('dash', hidden)).toHaveLength(0);
    await fireEvent(screen.getByTestId('line', hidden), 'layout', layout(80));
    expect(screen.getAllByTestId('dash', hidden)).toHaveLength(10);
  });

  it('shows the dashes of a dashed line even while it animates', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await render(<DrawLine testID="line" variant="dashed" />);
    await fireEvent(screen.getByTestId('line', hidden), 'layout', layout(80));
    expect(screen.getAllByTestId('dash', hidden).length).toBeGreaterThan(0);
  });

  // The system setting is unknown for a moment after mount. A line must not start drawing on a
  // guess, even when its width is measured before the answer arrives.
  it('does not start drawing until the reduced-motion setting is known', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest.mocked(useReducedMotion).mockReturnValue(undefined);
    await render(<DrawLine testID="line" />);
    await fireEvent(screen.getByTestId('line', hidden), 'layout', layout(80));
    expect(timing).not.toHaveBeenCalled();
    timing.mockRestore();
  });
});
