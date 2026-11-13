# ADR-0007: Repository structure

## Status
Accepted (2026-11-11, product owner)

## Context
`05` proposes `apps/mobile`, `backend/` or `supabase/`, and `packages/contracts/`, and allows a simpler structure if deviations are explained.

## Decision
Start with:
```text
lunea/
├── apps/mobile/          # Expo app (ADR-0001)
├── supabase/             # only if ADR-0002 is accepted
├── docs/ (incl. docs/adr/)
├── .github/
└── CLAUDE.md, CODEX_REVIEW.md, README.md, .coderabbit.yaml
```
Deviations from `05`:
- **No `packages/contracts/` and no workspace tooling yet.** Zod schemas start in `apps/mobile/src/contracts/`. Extract a shared package only when a second consumer exists (e.g. Edge Functions). Because Edge Functions run on Deno, the extraction method (relative import vs. published package) is decided at that time.
- **No `backend/`** unless ADR-0002 falls back to option B.
- **No `scripts/`** until a script exists.

## Consequences
- Less tooling to configure for FND-02; one `package.json` to start.
- A later move to npm workspaces is a mechanical refactor in its own PR.

## Owner
Product owner (human).

## Review trigger
Second code consumer of shared schemas.
