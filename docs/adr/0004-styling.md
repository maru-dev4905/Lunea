# ADR-0004: Styling approach

## Status
Accepted (2026-11-11, product owner)

## Context
Visual spec (`04`) wants semantic tokens, restrained visuals, light/dark TBD (D-20), Korean long-form readability, reduced motion.

## Options
1. **React Native `StyleSheet` + typed theme tokens module** (`src/theme`).
2. Emotion Native — styled-components API; extra runtime and dependency.
3. Utility-class libraries (e.g. NativeWind) — fast to write, but adds a build layer and a different mental model.

## Decision
Accepted: option 1. Tokens (`background`, `surface`, `textPrimary`, … from `04`) live in one typed module; components read tokens through a small `useTheme()` hook so light/dark can be added later without rewriting components. Exact palette and fonts remain TBD.

## Consequences
- Zero extra styling dependency.
- If a design system grows complex, revisit Emotion Native with a concrete justification.

## Owner
Product owner (human).

## Review trigger
Approved high-fi design that StyleSheet + tokens cannot express cleanly.
