# 09 — Initial MVP Backlog

IDs below are local labels, not Jira issue keys. Create actual Jira IDs only after the project exists.

## Foundation (P0)
**FND-01 Repository baseline:** create repo, protected main, docs, agent instructions, issue/PR templates, CI. AC: clean checkout passes baseline CI.
**FND-02 Expo scaffold:** Expo + RN + TS + Router; environment config. AC: runs on supported simulator/device.
**FND-03 ADRs:** record backend, auth, DB, AI provider, state/style, testing decisions.

## Product/design
**UX-01 Core wireframes (P0):** Today, Journal, Emotion Review, Save, Collection, Detail, Settings. AC: product owner reviews low-fi flow.
**DS-01 Tokens/components (P1):** semantic tokens and base states. AC: core flow uses shared tokens and passes accessibility review.
**PRD-01 User validation (P1):** 5–8 exploratory interviews; findings documented.

## Auth/privacy
**AUTH-01 Sign-in (P0):** auth, refresh, logout, errors tested.
**PRIV-01 User-scoped access (P0):** server checks/RLS; cross-user tests fail safely.
**PRIV-02 AI disclosure (P0):** explain external processing before first analysis and in settings.

## Journal
**JRN-01 Draft composer (P0):** create/edit draft; recover after transient failure.
**JRN-02 Plain save (P0):** allow saving without AI if approved; retrieve record.

## AI
**AI-01 Emotion schema (P0):** versioned Zod schema; valid/invalid/empty/mixed tests.
**AI-02 Server provider adapter (P0):** selected provider behind adapter; no client secret; timeout/retry tests.
**AI-03 Candidate generation (P0):** evidence-grounded candidates; never confirmed by default.
**AI-04 Review controls (P0):** accept/edit/remove/add/skip; explicit confirmation.
**AI-05 Regression suite (P1):** synthetic dataset and rubric; prompt/schema changes run tests.

## Collection
**COL-01 Confirmed save (P0):** explicit user confirmation and duplicate protection.
**COL-02 List (P1):** date order, pagination, owner-only.
**COL-03 Detail (P1):** original and confirmed content provenance clear.
**COL-04 Edit/delete (P1):** ownership and deletion tested.

## Release
**REL-01 Device QA (P1):** iOS/Android test matrix.
**REL-02 Privacy/security review (P0):** provider terms, logs, deletion, access controls.
**REL-03 Beta readiness (P2):** monitoring, feedback route, human release approval.

## Suggested order
FND-01 → FND-02 → FND-03 → UX-01/AI-01 → AUTH-01/PRIV-01 → JRN-01/JRN-02 → AI-02/03/04/05 → COL-01/02/03/04 → REL-01/02/03.
Do not build every screen before proving journal → analysis → user review → save.
