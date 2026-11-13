# 05 — Technical Architecture

## Goals
One mobile codebase; type-safe client/server contracts; server-side AI secrets; isolated user data; replaceable AI provider; simple MVP architecture; no premature microservices.

## Stack (see `docs/adr/` for status and conditions)
| Layer | Proposal | Status |
|---|---|---|
| Mobile | React Native + Expo | Accepted (ADR-0001) |
| Language | TypeScript (strict) | Accepted (ADR-0001) |
| Navigation | Expo Router | Accepted (ADR-0001) |
| Server state | TanStack Query | Accepted (ADR-0001) |
| Client state | No global state library initially; add one (Zustand candidate) only via ADR update | Accepted (ADR-0003) |
| Validation | Zod | Accepted (ADR-0001) |
| Motion | Reanimated | Optional |
| Styling | React Native StyleSheet + typed theme tokens; Emotion Native deferred | Accepted (ADR-0004) |
| Database/Auth | Supabase (PostgreSQL-based) | Supabase accepted conditionally (ADR-0002; final after PoC gates). D-07 PostgreSQL stays Proposed until confirmed with the backend |
| API | Supabase Edge Functions (fallback: Node.js TypeScript API) | Accepted conditionally (ADR-0002) |
| AI | Server-side adapter, mock provider until D-08 | Accepted (ADR-0006); provider TBD |
| Tests | Jest (jest-expo) + React Native Testing Library; Maestro for E2E | Accepted (ADR-0005) |
| CI | GitHub Actions | Accepted (in use since FND-01; checks per ADR-0005) |
| Primary developer | Claude Code | Accepted |
| Reviewer | CodeRabbit | Accepted (current) |
| Additional reviewer | Codex | Deferred (D-21) |
| Orchestration | Orca (worktree per task) + Superpowers; pstack removed, OMC not used | Accepted (`docs/11`) |

## Logical architecture
Mobile app (Expo) → authenticated backend boundary (auth, authorization, validation, journal CRUD, AI orchestration, rate limits) → PostgreSQL and AI provider. Provider secrets never enter mobile client.

## Proposed repository structure
```text
lunea/
├── apps/mobile/
│   ├── app/
│   ├── src/components/
│   ├── src/features/{auth,journal,emotion-review,collection,settings}/
│   ├── src/lib/
│   ├── src/services/
│   ├── src/state/
│   ├── src/theme/
│   └── assets/
├── backend/                 # if standalone API selected
├── supabase/                # if Supabase selected
├── packages/contracts/      # shared schemas if useful
├── docs/
├── scripts/
├── .github/
├── CLAUDE.md
├── CODEX_REVIEW.md
└── README.md
```

Claude may propose a simpler structure, but must explain deviations before changing boundaries.

## Boundaries
UI never calls LLM directly. UI contains no authorization logic. Domain logic is separate from rendering. AI provider is behind an adapter. Validate external inputs and AI outputs at runtime. Keep original text separate from summaries/labels. No LLM for deterministic arithmetic or ordinary database filtering.

## Environments
Development, staging, production separated. `.env.example` contains variable names/descriptions only. Never commit `.env`, keys, real journal text, or production data.

## Proof-of-concept gates
Validate auth/session refresh, user-scoped CRUD/RLS, server-side AI structured output, secret management, deletion, provider latency/cost/retention/training terms.

## Observability
Capture request ID, operation, latency, provider/model, token counts/cost estimate, schema outcome, safe error code. Do not log journal text, raw sensitive prompts, tokens, or secrets.

## ADRs required
Backend/API, DB/auth, AI provider/model, emotion schema/taxonomy, Balance, retention/deletion, state/styling libraries, E2E test framework.
Drafts live in `docs/adr/` (index: `docs/adr/README.md`).
