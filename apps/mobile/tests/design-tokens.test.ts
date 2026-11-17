import { tokens } from '@/theme';

import { contrastRatio } from './contrast';

// D-34 (owner, 2026-11-16): bright warm-white background, one black ink as the only accent.
describe('visual direction (D-34)', () => {
  it('uses a bright warm white background', () => {
    expect(tokens.color.background).toBe('#FAF9F6');
  });

  it('uses black ink as the accent and for primary text', () => {
    expect(tokens.color.accent).toBe('#151515');
    expect(tokens.color.textPrimary).toBe('#151515');
  });

  it('defines the color used on top of the accent', () => {
    expect(tokens.color.onAccent).toEqual(expect.any(String));
  });
});

// LUN-15 / docs/04: text must stay readable (WCAG AA 4.5:1). Also closes the STATUS note
// that textMuted on surface was about 4.2:1.
describe('text contrast (WCAG AA 4.5:1)', () => {
  const c = tokens.color;
  it.each([
    ['textPrimary', 'background', c.textPrimary, c.background],
    ['textPrimary', 'surface', c.textPrimary, c.surface],
    ['textSecondary', 'background', c.textSecondary, c.background],
    ['textSecondary', 'surface', c.textSecondary, c.surface],
    ['textMuted', 'background', c.textMuted, c.background],
    ['textMuted', 'surface', c.textMuted, c.surface],
    ['onAccent', 'accent', c.onAccent, c.accent],
    ['danger', 'background', c.danger, c.background],
    ['warning', 'background', c.warning, c.background],
    ['success', 'background', c.success, c.background],
  ])('%s on %s', (_fgName, _bgName, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

// docs/04 "Motion": subtle and short, never competing with reading.
describe('spacing and radius tokens', () => {
  it('grow in order', () => {
    const { space, radius } = tokens;
    expect([space.xs, space.sm, space.md, space.lg, space.xl]).toEqual(
      [space.xs, space.sm, space.md, space.lg, space.xl].slice().sort((a, b) => a - b),
    );
    expect(radius.sm).toBeLessThan(radius.md);
    expect(radius.md).toBeLessThan(radius.pill);
  });
});

describe('motion tokens', () => {
  it('keeps durations short', () => {
    const { duration } = tokens.motion;
    expect(duration.fast).toBeLessThan(duration.base);
    expect(duration.base).toBeLessThan(duration.slow);
    expect(duration.slow).toBeLessThanOrEqual(500);
  });

  it('defines springs for the leading and trailing edge of the tab indicator', () => {
    const { leading, trailing } = tokens.motion.spring;
    expect(leading.stiffness).toBeGreaterThan(trailing.stiffness);
  });
});
