# ADR-0001: Mobile app stack

## Status
Accepted (2026-11-11, product owner)

## Context
D-02 (mobile, iOS + Android) is Accepted. D-04 (React Native + Expo + TypeScript) and D-05 (Expo Router) are Proposed. The team is one human owner plus AI agents, so build/release operations must stay simple.

## Options
1. **Expo (managed workflow, CNG) + React Native + TypeScript + Expo Router** — one codebase, file-based routing, EAS Build for both platforms, no committed `ios/`/`android/` folders.
2. Bare React Native CLI + React Navigation — more native control, more maintenance.
3. Flutter — strong UI toolkit, but leaves the TypeScript ecosystem shared with backend/contracts.
4. Native apps (Swift + Kotlin) — two codebases; not proportional for MVP.

## Decision
Proposed: option 1.
- Use the latest stable Expo SDK at scaffold time (pin exact versions in the lockfile; do not guess versions in docs).
- TypeScript `strict: true`.
- Expo Router for navigation (Today / Collection / Settings tabs as proposed in `03`, not final IA).
- TanStack Query for server state; Zod for runtime validation (both already Proposed in `05`).
- Reanimated only when a concrete motion need appears, and always behind reduced-motion checks.
- `expo-secure-store` for auth tokens (PRD: platform-appropriate secure storage).

## Consequences
- Fast iteration through Expo Go / dev builds; EAS account needed later for store builds (human action, not required for scaffold).
- Native modules outside the Expo ecosystem require config plugins or a dev build.
- `.gitignore` already excludes generated `ios/` and `android/`.

## Owner
Product owner (human).

## Review trigger
A required native capability Expo cannot support, or Expo Router blocking an approved IA.
