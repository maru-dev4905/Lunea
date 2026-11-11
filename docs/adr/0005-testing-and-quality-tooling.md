# ADR-0005: Testing and quality tooling

## Status
Accepted (2026-11-11, product owner)

## Context
CI minimum (`08`): lockfile install, format, lint, typecheck, unit tests, build, dependency check. Release gates need cross-user access tests and AI schema regression tests.

## Options and decision
| Concern | Proposal | Alternatives considered |
|---|---|---|
| Package manager | npm (Expo's default; fewest workspace quirks) | pnpm (needs hoisting config with Expo), yarn |
| Format | Prettier | Biome (faster, smaller ecosystem for RN rules) |
| Lint | ESLint with Expo's config | Biome |
| Typecheck | `tsc --noEmit` | — |
| Unit/component tests | Jest via `jest-expo` + React Native Testing Library | Vitest (weaker RN support) |
| Schema/AI tests | Jest unit tests on Zod schemas with synthetic fixtures only | — |
| RLS/authorization tests | Tests against local Supabase (if ADR-0002 accepted) | — |
| E2E | **Maestro**, added after core flow exists (REL-01) | Detox (more setup, flakier on CI) |
| Build check in CI | `expo export` (bundle build) | EAS build on every PR (slow, needs account) |
| Dependency updates | Dependabot (once enabled by owner) | Renovate |

## Consequences
- CI `baseline` job is replaced with real steps in the FND-02 scaffold PR.
- No real journal text in fixtures, ever; synthetic Korean samples only.

## Owner
Product owner (human).

## Review trigger
Flaky or slow CI, or E2E needs Maestro cannot meet.
