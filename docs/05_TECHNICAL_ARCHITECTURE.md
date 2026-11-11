# 05 — Technical Architecture

## Goals
One mobile codebase; type-safe client/server contracts; server-side AI secrets; isolated user data; replaceable AI provider; simple MVP architecture; no premature microservices.

## Proposed stack (not all final)
| Layer | Proposal | Status |
|---|---|---|
| Mobile | React Native + Expo | Proposed |
| Language | TypeScript | Proposed |
| Navigation | Expo Router | Proposed |
| Server state | TanStack Query | Proposed |
| Client state | Jotai or Zustand only if needed | TBD; don't install both |
| Validation | Zod | Proposed |
| Motion | Reanimated | Optional |
| Styling | React Native StyleSheet initially; Emotion Native only if justified | TBD |
| Database/Auth | Supabase + PostgreSQL candidate | TBD after RLS/auth proof |
| API | Supabase Edge Functions or Node.js TypeScript API | TBD |
| AI | Provider SDK behind adapter | Proposed |
| Tests | Unit + React Native Testing Library + Maestro/Detox candidate | Select after scaffold |
| CI | GitHub Actions | Proposed |
| Primary developer | Claude Code | Accepted |
| Reviewer | CodeRabbit | Accepted (current) |
| Additional reviewer | Codex | Deferred (D-21) |
| Orchestration | Orca CLI only when parallel work is needed | Optional |

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
