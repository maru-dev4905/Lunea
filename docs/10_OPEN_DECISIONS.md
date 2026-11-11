# 10 — Open Decisions

| ID | Topic | Status | Next step |
|---|---|---|---|
| D-01 | Human-final emotion interpretation | Accepted | Preserve |
| D-02 | Mobile app | Accepted | Confirm supported OS/minimum versions |
| D-03 | Korean-first | Proposed | Validate |
| D-04 | React Native + Expo + TS | Proposed | Scaffold PoC |
| D-05 | Expo Router | Proposed | Validate |
| D-06 | Supabase vs standalone Node API | TBD | Compare auth/RLS/ops |
| D-07 | PostgreSQL | Proposed | Confirm with backend |
| D-08 | AI provider/model | TBD | Compare quality, cost, latency, privacy |
| D-09 | Jotai vs Zustand vs none | TBD | Start simple |
| D-10 | StyleSheet vs Emotion Native | TBD | Prototype first |
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
| D-21 | Independent reviewer tooling | Accepted: CodeRabbit now; Codex deferred | Add Codex (GitHub review needs paid ChatGPT plan) when feature development starts; confirm CodeRabbit private-repo pricing |

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
