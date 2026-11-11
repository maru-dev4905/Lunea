# ADR-0003: Client state management

## Status
Proposed (D-09 TBD)

## Context
`05` says "Jotai or Zustand only if needed; don't install both". Most app state is server state (entries, analysis runs) handled by TanStack Query. Local state: draft text, review edits, UI toggles.

## Options
1. **No global state library initially** — TanStack Query + React state/context; drafts persisted with a small storage helper.
2. Zustand — simple store, good for cross-screen draft/review state.
3. Jotai — atomic state, fine-grained updates.

## Decision
Proposed: option 1. Add **one** library (Zustand is the default candidate for its simplicity) only when a concrete cross-screen state problem appears, via a separate ADR update.

## Consequences
- Fewer dependencies; no premature abstraction.
- Draft persistence (JRN-01: survive navigation and transient failure) needs an explicit design; journal text stored on device is sensitive and needs a privacy decision before implementation.

## Owner
Product owner (human).

## Review trigger
Prop drilling or duplicated state across 3+ screens, or draft/review flow requiring shared state.
