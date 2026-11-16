// Semantic theme tokens (ADR-0004, docs/04_VISUAL_DESIGN_SPEC.md).
// Visual direction D-34 (owner, 2026-11-16): bright warm white, one black ink as the only
// accent, hairline strokes, calm motion. Dark mode (D-20) and fonts are still undecided.
// Components must read tokens via useTheme().
export const tokens = {
  color: {
    background: '#FAF9F6',
    surface: '#F1F0EC',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#151515',
    textSecondary: '#4A4A47',
    textMuted: '#6B6B67',
    borderSubtle: '#E4E2DD',
    accent: '#151515',
    accentSoft: '#ECEBE8',
    onAccent: '#FAF9F6',
    success: '#2E7D32',
    warning: '#8F5400',
    danger: '#C62828',
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 8, md: 12, pill: 999 },
  // As soft as a ripple spreading on still water (owner, 2026-11-16): unhurried durations,
  // long soft landings, no bounce, one-shot and never looping. Every animation must also work
  // with reduced motion.
  motion: {
    // fast/base/slow: ordinary transitions. draw: a line drawing itself.
    duration: { fast: 220, base: 520, slow: 800, draw: 1100 },
    stagger: 120,
    // cubic-bezier control points. calm: quick start and a very long soft landing.
    // fade: gentle in and out.
    easing: { calm: [0.16, 1, 0.3, 1], fade: [0.37, 0, 0.63, 1] },
    // The tab indicator stretches: its leading edge glides ahead, the trailing edge follows.
    // Both are damped enough (ratio about 0.9 or more) not to overshoot.
    spring: {
      leading: { stiffness: 120, damping: 20, mass: 1 },
      trailing: { stiffness: 55, damping: 14, mass: 1 },
    },
  },
} as const;

export type Theme = typeof tokens;
export type ColorToken = keyof Theme['color'];
