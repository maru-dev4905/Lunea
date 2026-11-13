import { renderHook } from '@testing-library/react-native';

import { tokens, useTheme } from '@/theme';

// 04_VISUAL_DESIGN_SPEC "Color tokens": semantic names only, values are TBD.
const REQUIRED_COLOR_TOKENS = [
  'background',
  'surface',
  'surfaceElevated',
  'textPrimary',
  'textSecondary',
  'textMuted',
  'borderSubtle',
  'accent',
  'accentSoft',
  'success',
  'warning',
  'danger',
] as const;

describe('theme tokens', () => {
  it.each(REQUIRED_COLOR_TOKENS)('defines the %s color token', (name) => {
    expect(tokens.color[name]).toEqual(expect.any(String));
  });

  it('exposes the tokens through useTheme()', async () => {
    const { result } = await renderHook(() => useTheme());
    expect(result.current).toBe(tokens);
  });
});
