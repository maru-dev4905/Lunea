import { tokens, type Theme } from './tokens';

// Single access point so light/dark can be added later without touching components.
export function useTheme(): Theme {
  return tokens;
}
