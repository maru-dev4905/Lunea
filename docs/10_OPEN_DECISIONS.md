# 10 — Open Decisions

| ID | Topic | Status | Next step |
|---|---|---|---|
| D-01 | Human-final emotion interpretation | Accepted | Preserve |
| D-02 | Mobile app | Accepted | Confirm supported OS/minimum versions |
| D-03 | Korean-first | Proposed | Validate |
| D-04 | React Native + Expo + TS | Accepted (ADR-0001) | Scaffold (FND-02) |
| D-05 | Expo Router | Accepted (ADR-0001) | Scaffold (FND-02) |
| D-06 | Supabase vs standalone Node API | Accepted conditionally: Supabase (ADR-0002) | Pass PoC gates; fallback Node API |
| D-07 | PostgreSQL | Proposed | Confirm with backend |
| D-08 | AI provider/model | TBD | Compare quality, cost, latency, privacy |
| D-09 | Jotai vs Zustand vs none | Accepted: none initially (ADR-0003) | Add one library only with ADR update |
| D-10 | StyleSheet vs Emotion Native | Accepted: StyleSheet + tokens (ADR-0004) | Revisit with approved high-fi design |
| D-11 | Balance definition/formula/MVP scope | TBD | Product workshop; no code yet |
| D-12 | Collection/receipt visual metaphor | TBD | Low-fi exploration |
| D-13 | Emotion taxonomy | TBD | Flexible Korean examples |
| D-14 | Multiple entries per day | TBD | UX decision |
| D-15 | Clarification chat in MVP | Proposed optional | Validate value/complexity |
| D-16 | Auth methods | TBD | Select |
| D-17 | Retention/export/deletion policy | TBD | Provider/legal review |
| D-18 | Crisis/safety policy | TBD | Specialist review |
| D-19 | Monetization | Deferred | Validate usefulness |
| D-20 | Light/dark mode | TBD | Decide after prototype |
| D-21 | Independent reviewer tooling | Accepted: CodeRabbit now; Codex deferred | Codex: add when feature development (Expo scaffold, FND-02) starts, by adopting a paid ChatGPT plan (Plus or higher); GitHub review is not available on the free plan. Confirm CodeRabbit private-repo pricing |
| D-22 | RAG / LangChain / n8n over journal data | Deferred | Decide with D-08/D-17: journal text sent to retrieval/AI services needs privacy review and consent |
| D-23 | Mode D: label → GitHub Actions Claude → PR | Deferred | Evaluate API cost and scope (small repetitive tasks only) |
| D-25 | Independent verification trigger | Accepted (2026-11-12): mode A owner runs `/lunea-verify` manually; mode C automatic | Revisit when orchestrator runs routinely |
| D-24 | Agent tooling | Accepted: Orca + Superpowers; pstack removed; OMC not used | See `docs/11_AGENT_WORKFLOW.md` |

## Questions Claude must not decide silently
1. Backend and deployment platform?
2. Which AI provider may process journal text?
3. What disclosure/consent is required?
4. What is Balance, how is it calculated, and is it in MVP?
5. What does Collection look like? Is receipt-like design still desired?
6. Multiple records per day?
7. Authentication methods?
8. Retention, export, deletion guarantees?
9. Crisis-related policy?
10. Launch region and legal review?

## Reversible scaffold assumptions
Private repo; protected main; PR flow; Expo+TS scaffold; modular feature folders; runtime schema validation; mock AI adapter; synthetic data only; no production credentials; no analytics containing journal text.

## ADR template
```md
# ADR-NNNN: Title
## Status
Proposed / Accepted / Rejected / Superseded
## Context
## Options
## Decision
## Consequences
## Owner
## Review trigger
```
