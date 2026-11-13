// Semantic theme tokens (ADR-0004, docs/04_VISUAL_DESIGN_SPEC.md).
// Palette, fonts and light/dark (D-20) are TBD: the values below are neutral
// placeholders, not a design decision. Components must read tokens via useTheme().
export const tokens = {
  color: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#4D4D4D',
    textMuted: '#767676',
    borderSubtle: '#E0E0E0',
    accent: '#5B5BD6',
    accentSoft: '#ECECFB',
    success: '#2E7D32',
    warning: '#B26A00',
    danger: '#C62828',
  },
} as const;

export type Theme = typeof tokens;
export type ColorToken = keyof Theme['color'];
