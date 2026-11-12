# Project Status

Agents: read this at session start; update it at session end (`/lunea-finish`). Keep it short and current — history belongs in `docs/journal/`.

Last updated: 2026-11-12

## Phase
Foundation. Planning baseline and tooling are in place; no application code yet.

## Done
- LUN-8 FND-01 Repository baseline (PR #1, merged)
- Review pipeline: CodeRabbit as the only external reviewer, Korean reviews (PR #2, merged)
- Jira backlog: epics LUN-1~7, tasks LUN-8~34 (`iseung10e.atlassian.net`, project `LUN`)

## In review
- LUN-9 FND-03 Stack ADRs (PR #3)
- LUN-34 FND-06 Agent workflow, commands, journal, lessons (PR #4, merge after PR #3)

## Next (in order)
1. LUN-10 FND-02 Expo scaffold — mode A (sequential). Adds real CI checks, worktree setup script, Stop-hook verification.
2. LUN-11 FND-04 Supabase PoC — mode A. Owner creates the `lunea-dev` project; PoC gates in ADR-0002.
3. LUN-12 FND-05 Interaction verification setup (EAS Update preview QR per PR, ADR-0008). Needs an Expo account (owner).
4. LUN-13 DOC-01 Resolve spec inconsistencies (state names, deletion semantics, clarification flow).

## Waiting on owner
- Merge PR #3, then this PR
- Supabase `lunea-dev` project (share Project URL only; never paste keys)
- Expo account (for preview QR)
- Jira automation rules (PR created → 검토 중, merged → 완료) and GitHub for Jira app
- `main` branch protection (manual; may require a paid plan for private repos)

## Open decisions (see docs/10)
D-08 AI provider, D-11 Balance, D-12 Collection metaphor, D-13 emotion taxonomy, D-14 multiple entries/day, D-16 auth methods, D-17 retention/deletion, D-18 crisis policy, D-20 light/dark, D-22 RAG over journal data, D-23 mode D (auto PR) cost.

## Environment facts
- Repo: `maru-dev4905/Lunea` (private). Default branch `main`.
- Jira: `iseung10e.atlassian.net`, project `LUN`; statuses 해야 할 일 → 진행 중 → 검토 중 → 완료.
- Slack: Jira Cloud app connected to `LUN`; GitHub app subscription pending/owner-managed.
- Language: PR titles/descriptions and commit bodies in Korean; docs in English.
