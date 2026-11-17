import { render, screen } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { useReducedMotion } from '@/motion/useReducedMotion';
import { Barcode } from '@/receipt/Barcode';

jest.mock('@/motion/useReducedMotion', () => ({ useReducedMotion: jest.fn() }));

const hidden = { includeHiddenElements: true };

describe('Barcode', () => {
  afterEach(() => jest.restoreAllMocks());

  it('does not start drawing until the reduced-motion setting is known', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest.mocked(useReducedMotion).mockReturnValue(undefined);
    await render(<Barcode />);
    expect(timing).not.toHaveBeenCalled();
  });

  it('does not draw at all when motion is reduced', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await render(<Barcode />);
    expect(timing).not.toHaveBeenCalled();
    expect(screen.getByTestId('barcode', hidden)).toBeOnTheScreen();
  });

  it('draws once the setting turns out to be off', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await render(<Barcode />);
    expect(timing).toHaveBeenCalledTimes(1);
  });
});
