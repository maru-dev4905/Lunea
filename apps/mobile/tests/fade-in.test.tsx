import { render, screen } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Animated, Text } from 'react-native';

import { FadeIn } from '@/motion/FadeIn';
import { useReducedMotion } from '@/motion/useReducedMotion';

jest.mock('@/motion/useReducedMotion', () => ({ useReducedMotion: jest.fn() }));

describe('FadeIn', () => {
  it('shows its content at full opacity right away when motion is reduced', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await render(
      <FadeIn testID="wrap">
        <Text>안녕</Text>
      </FadeIn>,
    );
    expect(screen.getByText('안녕')).toBeOnTheScreen();
    expect(screen.getByTestId('wrap')).toHaveStyle({ opacity: 1 });
  });

  it('always renders its content, even while animating in', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await render(
      <FadeIn>
        <Text>안녕</Text>
      </FadeIn>,
    );
    expect(screen.getByText('안녕')).toBeOnTheScreen();
  });

  // The system setting is not known for a moment after mount. Motion must wait for the answer,
  // not start on a guess, so someone who asked for reduced motion never sees it move.
  it('does not animate while the setting is still unknown, and keeps the content hidden', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest.mocked(useReducedMotion).mockReturnValue(undefined);
    await render(
      <FadeIn testID="wrap">
        <Text>안녕</Text>
      </FadeIn>,
    );
    expect(timing).not.toHaveBeenCalled();
    expect(screen.getByTestId('wrap')).toHaveStyle({ opacity: 0 });
    timing.mockRestore();
  });

  it('animates once the setting turns out to be off', async () => {
    const timing = jest.spyOn(Animated, 'timing');
    jest.mocked(useReducedMotion).mockReturnValue(undefined);
    const view = await render(
      <FadeIn>
        <Text>안녕</Text>
      </FadeIn>,
    );
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await view.rerender(
      <FadeIn>
        <Text>안녕</Text>
      </FadeIn>,
    );
    expect(timing).toHaveBeenCalled();
    timing.mockRestore();
  });

  // Swapping the wrapper type would remount everything inside, including a focused text input.
  it('keeps its children mounted when the reduced-motion setting changes', async () => {
    let mounts = 0;
    function Probe() {
      useEffect(() => {
        mounts += 1;
      }, []);
      return <Text>안녕</Text>;
    }
    jest.mocked(useReducedMotion).mockReturnValue(false);
    const view = await render(
      <FadeIn>
        <Probe />
      </FadeIn>,
    );
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await view.rerender(
      <FadeIn>
        <Probe />
      </FadeIn>,
    );
    jest.mocked(useReducedMotion).mockReturnValue(false);
    await view.rerender(
      <FadeIn>
        <Probe />
      </FadeIn>,
    );
    expect(mounts).toBe(1);
  });
});
