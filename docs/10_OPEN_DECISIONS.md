# 10 — Open Decisions

| ID | Topic | Status | Next step |
|---|---|---|---|
| D-01 | Human-final emotion interpretation | Accepted | Preserve |
| D-02 | Mobile app (extended by D-27 to include web) | Accepted | Confirm supported OS/minimum versions |
| D-03 | Korean-first | Proposed | Validate |
| D-04 | React Native + Expo + TS | Accepted (ADR-0001) | Scaffold (FND-02) |
| D-05 | Expo Router | Accepted (ADR-0001) | Scaffold (FND-02) |
| D-06 | Supabase vs standalone Node API | Accepted conditionally: Supabase (ADR-0002) | Pass PoC gates; fallback Node API |
| D-07 | PostgreSQL | Proposed | Confirm with backend |
| D-08 | AI provider/model | TBD | Compare quality, cost, latency, privacy |
| D-09 | Jotai vs Zustand vs none | Accepted: none initially (ADR-0003) | Add one library only with ADR update |
| D-10 | StyleSheet vs Emotion Native | Accepted: StyleSheet + tokens (ADR-0004) | Revisit with approved high-fi design |
| D-11 | Balance definition/formula/MVP scope | TBD | Product workshop; no code yet |
| D-12 | Collection/receipt visual metaphor | Accepted provisionally (2026-11-16, owner): a receipt-like look, laid out like a real receipt, is the shareable view of a saved record; prototype on synthetic data (LUN-35) | Keep it inside `src/receipt` and `app/receipt`, never hard-coded elsewhere. Thermal-paper textures, perforated edges and generated keepsake objects are still not approved. Revisit after real users have seen it |
| D-13 | Emotion taxonomy | TBD | Flexible Korean examples |
| D-14 | Multiple entries per day | TBD | UX decision |
| D-15 | Clarification chat in MVP | Deferred (2026-11-16, owner): not in the MVP, revisit later | Revisit once the MVP is usable and an eval set can check that questions neither lead nor invent details (docs/07). If added: a clarification state and an answer endpoint in docs/06. `followUpQuestion` stays reserved (null) until then |
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
| D-27 | Platforms: iOS, Android and Web | Accepted (2026-11-13, product owner): the app must work both as a native app and on the web from one Expo codebase | See ADR-0001 amendment; web storage for auth tokens and journal drafts is decided in the auth/storage work (D-16, FND-04); revisit if web needs diverge from native |
| D-28 | Supabase environments | Accepted (2026-11-13, product owner): separate dev / staging / prod projects; dev = existing project `lunea`; staging and prod created later by the owner | See ADR-0002 "Environments"; prod only after PoC gates 3 and 5 pass; names of staging/prod TBD |
| D-26 | Git branching | Accepted (2026-11-13): `dev` default/integration (squash), `main` release-only (merge commit + tag), Jira 완료 on merge to `dev` | See `docs/11_AGENT_WORKFLOW.md` §5a; revisit if multiple release trains are needed |
| D-29 | Interaction verification | Accepted (2026-11-16, ADR-0008): per-PR device preview with EAS Update + Expo Go; `expo-updates` added deliberately; no production OTA | Before the first EAS Build, decide `updates.checkAutomatically`; staging/prod values never go into previews |
| D-30 | Deletion semantics | Accepted (2026-11-16, owner adopted Claude's recommendation) | Hard delete from active tables on user request (validated in FND-04). No `deleted` status. UI copy separates "deleting" from "deleted" and says deletion is complete only after the backend confirms (docs/02). Backup retention still follows D-17 and PoC condition 5 |
| D-31 | Original text vs edits | Accepted (2026-11-16, owner adopted Claude's recommendation) | `body_original` is never rewritten. Edits are kept as revisions, the current text is the latest revision, and the user must re-confirm the interpretation when the text changes after confirmation. Detailed revision schema is decided in the data model work (PRIV-01, COL-01) |
| D-32 | Save without AI | Accepted (2026-11-16, owner) | Saving a record without AI is allowed and a record may have zero emotions. Applied in docs/02, docs/03, docs/09 (JRN-02). AI disclosure (PRIV-02) still applies before the first analysis |
| D-33 | Evidence verification | Accepted provisionally (2026-11-16, owner) | A similarity match against the original text is allowed instead of an exact match. Define the algorithm and threshold in AI-01/AI-03 with synthetic Korean cases (typos, spacing, particles) and review once the eval set exists. Guardrail (owner adopted, from docs/07 "fabricated quote" release blocker): show the matched span of the user's own text, never the model's rewording as a quote |
| D-34 | Visual direction | Accepted (2026-11-16, owner) | Bright warm white `#FAF9F6`, black ink `#151515` as the only accent, hairline strokes, calm motion, sliding-pill tab bar (variant 1 of a public tab-bar motion sample; inspiration only, no paid content copied). Applied in `tokens.ts`, tab bar and screen entrances (LUN-15). Revisit when the high-fi core flow is designed. Dark mode (D-20), fonts and the other five tab-bar variants stay open. All motion needs a reduced-motion fallback |
| D-35 | Product direction | Accepted (2026-11-16, owner): direction A. Keep the single-user journal; the receipt is a shareable output of a saved record. Couples (sign-up, pairing, shared records) are deferred until the receipt is validated | The owner will give the service to acquaintances, and may later use the accumulated data in a portfolio. Before real users: consent and privacy notice, retention and deletion (D-17), AI disclosure (PRIV-02), PoC conditions 3 and 5, staging/prod Supabase. Using user data in a portfolio needs explicit consent and anonymization (not decided). Points and streaks: see D-37 |
| D-36 | No background fills in the UI | Accepted (2026-11-16, owner): UI shapes are told apart by lines, shadows and motion only, never by a background color. The only fill is the screen canvas (`color.background`); thin bars that are lines in practice (hairlines, dashes, the tab indicator, barcode bars) may be drawn filled | Enforced by `tests/no-fills.test.ts`. Buttons and notices are outlined. Surface-like tokens (`surface`, `accentSoft`) are not used as fills. Motion must be as soft as a ripple on still water: unhurried, no bounce, one-shot, with a reduced-motion fallback. A touch ripple effect was a misreading and was removed |
| D-37 | Receipt economy: price, deposit, balance, streak, sharing | Accepted (2026-11-17, owner, decided one by one): see `docs/01_PRODUCT_BRIEF.md` "Receipt economy". Price = the size of a feeling, chosen by the user. Every feeling deposits the same way and a deposit never decreases. A streak is protected by rest tickets earned by recording. The balance unlocks look-back receipts. One receipt per saved entry. Sharing is an image export the user previews, with the event and quotes hidden by default | **D-11 is still TBD** (price is not Balance). Open details: the size scale and the amount per size, ticket earn and use numbers, unlock thresholds, what a look-back receipt contains (AI wording needs its own decision), per-day rules once D-14 is decided, country or currency source, internal unit. Guardrails (charter 4-5): feelings are never ranked, no guilt or loss wording, nothing mandatory, the original text is always readable whatever the balance. The prototype still uses synthetic numbers |
| D-38 | Manual emotion entry on plain save | Accepted (2026-11-19, owner): option 1. Saving without AI has no emotion input step; labels come only from the AI review, and such a record has zero emotions (D-32). | A manual add step may be reconsidered later; it would be a new step in docs/03a. |

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
Public repo (since 2026-11-13); `main` and `dev` protected by Rulesets (since 2026-11-13: PR required, `baseline` check required, no deletion or force push); PR flow into `dev` (D-26); Expo+TS scaffold; modular feature folders; runtime schema validation; mock AI adapter; synthetic data only; no production credentials; no analytics containing journal text.

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
