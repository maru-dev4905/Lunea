# ADR-0001: Mobile app stack

## Status
Accepted (2026-11-11, product owner)

## Context
D-02 (mobile, iOS + Android) is Accepted. D-04 (React Native + Expo + TypeScript) and D-05 (Expo Router) were Proposed at the time of writing and are accepted by this ADR. The team is one human owner plus AI agents, so build/release operations must stay simple.

## Options
1. **Expo (managed workflow, CNG) + React Native + TypeScript + Expo Router** — one codebase, file-based routing, EAS Build for both platforms, no committed `ios/`/`android/` folders.
2. Bare React Native CLI + React Navigation — more native control, more maintenance.
3. Flutter — strong UI toolkit, but leaves the TypeScript ecosystem shared with backend/contracts.
4. Native apps (Swift + Kotlin) — two codebases; not proportional for MVP.

## Decision
Accepted: option 1.
- Use the latest stable Expo SDK at scaffold time (pin exact versions in the lockfile; do not guess versions in docs).
- TypeScript `strict: true`.
- Expo Router for navigation (Today / Collection / Settings tabs as proposed in `03`, not final IA).
- TanStack Query for server state; Zod for runtime validation (Proposed in `05`, accepted by this ADR).
- Reanimated only when a concrete motion need appears, and always behind reduced-motion checks.
- `expo-secure-store` for auth tokens (PRD: platform-appropriate secure storage).

## Consequences
- Fast iteration through Expo Go / dev builds; EAS account needed later for store builds (human action, not required for scaffold).
- Native modules outside the Expo ecosystem require config plugins or a dev build.
- `.gitignore` already excludes generated `ios/` and `android/`.

## Amendment (2026-11-13, product owner): web support
The product must be usable both as a native app (iOS, Android) and on the web (D-27). The same Expo + Expo Router codebase targets all three platforms through `react-native-web` (with `@expo/metro-runtime`); no separate web codebase.
- CI builds all three bundles (`expo export` for ios, android, web).
- Every dependency must be checked for web support before it is added. `expo-secure-store` above has no web implementation: how auth tokens are stored on the web is decided with the auth work (D-16, ADR-0002 PoC), not assumed here.
- Privacy rules are platform-independent: no raw journal text in logs, and no unreviewed persistence of journal text in browser storage.
- Responsive layout and web accessibility (keyboard, focus, screen reader) enter the design work (UX-01) and the Definition of Done for UI tickets.

## Owner
Product owner (human).

## Review trigger
A required native capability Expo cannot support, or Expo Router blocking an approved IA.
