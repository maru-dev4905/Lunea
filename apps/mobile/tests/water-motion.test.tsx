import {
  isHiddenFromAccessibility,
  render,
  screen,
  fireEvent,
} from '@testing-library/react-native';
import { Text } from 'react-native';

import { DrawLine } from '@/motion/DrawLine';
import { RippleSurface } from '@/motion/RippleSurface';
import { useReducedMotion } from '@/motion/useReducedMotion';

jest.mock('@/motion/useReducedMotion', () => ({ useReducedMotion: jest.fn() }));

const touch = { nativeEvent: { locationX: 40, locationY: 30 } };
// Decorative parts are hidden from screen readers on purpose, and Testing Library skips hidden
// elements unless asked. Without this a "no rings" check would pass vacuously.
const hidden = { includeHiddenElements: true };
const rings = () => screen.queryAllByTestId('ripple-ring', hidden);

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
});

describe('RippleSurface', () => {
  const surface = () =>
    render(
      <RippleSurface testID="surface">
        <Text>안녕</Text>
      </RippleSurface>,
    );

  it('keeps its content readable by screen readers', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await surface();
    expect(isHiddenFromAccessibility(screen.getByText('안녕'))).toBe(false);
  });

  it('sends out rings where the finger touches', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await surface();
    expect(rings()).toHaveLength(0);
    await fireEvent(screen.getByTestId('surface'), 'pressIn', touch);
    expect(rings().length).toBeGreaterThan(0);
  });

  it('hides the rings from screen readers', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await surface();
    await fireEvent(screen.getByTestId('surface'), 'pressIn', touch);
    rings().forEach((ring) => {
      expect(isHiddenFromAccessibility(ring)).toBe(true);
    });
  });

  it('never keeps more rings alive than the limit, however fast it is touched', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await surface();
    const perTouch = await (async () => {
      await fireEvent(screen.getByTestId('surface'), 'pressIn', touch);
      return rings().length;
    })();
    for (let i = 0; i < 12; i += 1) {
      await fireEvent(screen.getByTestId('surface'), 'pressIn', touch);
    }
    expect(rings().length).toBeLessThanOrEqual(perTouch * 4);
  });

  it('shows no rings at all when motion is reduced', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await surface();
    await fireEvent(screen.getByTestId('surface'), 'pressIn', touch);
    expect(rings()).toHaveLength(0);
  });

  it('still works when the touch position is unknown', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await surface();
    await fireEvent(screen.getByTestId('surface'), 'pressIn', { nativeEvent: {} });
    expect(rings().length).toBeGreaterThan(0);
  });
});
