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
  // Subtle and short (docs/04). Every animation must also work with reduced motion.
  motion: {
    duration: { fast: 150, base: 250, slow: 400 },
    // The tab indicator stretches: its leading edge springs quickly, the trailing edge follows.
    spring: {
      leading: { stiffness: 260, damping: 19, mass: 1 },
      trailing: { stiffness: 110, damping: 16, mass: 1 },
    },
  },
} as const;

export type Theme = typeof tokens;
export type ColorToken = keyof Theme['color'];
