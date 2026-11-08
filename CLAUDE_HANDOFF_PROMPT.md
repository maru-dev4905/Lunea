# Claude Code — Initial Project Handoff Prompt

You are taking ownership of initial GitHub repository setup and technical bootstrap for Lunéa. Human is product owner; you are primary developer; Codex is independent reviewer.

## Phase 1 — Inspect
Read README, CLAUDE.md, CODEX_REVIEW.md, and all docs. List accepted/proposed/TBD decisions, contradictions, missing info, risks. Propose minimum repo structure and explain deviations. Present setup plan, required permissions, and external account/secret requirements. Stop before public repo creation or account/security setting changes without approval.

## Phase 2 — Repository
After explicit approval:
1. Create repository `lunea`; recommend private during early development and ask if visibility is unclear.
2. Initialize main with docs, README, CLAUDE.md, CODEX_REVIEW.md.
3. Add `.gitignore`, `.editorconfig`, license decision note, issue/PR templates, baseline CI.
4. Protect main where possible: require PR and CI, disable force push and branch deletion.
5. Do not create permanent `develop`.
6. Use short-lived bootstrap branch such as `chore/bootstrap-repository` for first scaffold PR.
7. Add only placeholder names to `.env.example`; no real secrets.
8. Report any step requiring human click/authorization.
If GitHub access is unavailable, do not claim success; provide exact commands/files.

## Phase 3 — Stack proposal
Compare Expo+RN+TS, Expo Router, Supabase vs standalone Node API, Jotai vs Zustand vs no global state, StyleSheet vs Emotion Native, and test frameworks. Do not install Jotai, Emotion, Orca, OMC, LangChain, or overlapping orchestration frameworks just because they were discussed. Recommend minimum useful stack. n8n and LangChain are not initially required absent a concrete need. Use mock AI adapter until provider and data terms are approved.

## Phase 4 — Quality
Run install, lint, typecheck, tests, build. Request Codex review of exact diff. Fix valid findings and rerun. Open PR with AC and evidence. Do not merge.

## Stop and ask
Before deciding Balance formula, Collection/receipt metaphor, AI provider for real journal text, retention/deletion promises, emotion taxonomy, sensitive analytics, auth/RLS/security policy, production data/secrets, destructive permissions, merge, or deploy.

## Final report
Repository URL only if actually created; branches actually created; files added; settings actually configured; commands/results; unresolved decisions; next human action. Never claim unverified success.
