import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

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
});
