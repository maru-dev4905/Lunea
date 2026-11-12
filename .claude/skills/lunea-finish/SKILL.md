---
name: lunea-finish
description: Finish a task — run checks, open the Korean PR, capture decisions/lessons, update STATUS. Use at the end of any implementation task.
---
# /lunea-finish

1. Run format, lint, typecheck, tests, build (whatever exists). Do not claim success for checks not run.
2. Open/refresh a non-draft PR in Korean using `.github/pull_request_template.md`, linking the Jira key.
3. Ask yourself, and answer in the PR under "결정 기록 / 교훈":
   - Was there a choice between options? → add/extend a `docs/journal/` entry using the template in `docs/journal/README.md` (the owner may also run `/lunea-log`).
   - Was there a mistake, rollback, or valid reviewer finding caused by an agent? → add a lesson following `.claude/skills/lunea-lesson/SKILL.md`.
4. Update `docs/STATUS.md` (Done / Next / Waiting on owner) — **skip this in mode C**; the orchestrator updates it.
5. Commit and push the journal/lesson/STATUS changes to the PR branch; confirm they appear in the PR diff.
6. Independent verification (Definition of Done layer 6): in mode C the orchestrator spawns the Verifier. In mode A, ask the owner to run `/lunea-verify <PR>` in a **fresh** session (or the orchestrator spawns one). Never verify your own PR.
7. Do not merge. Jira moves to `검토 중` by automation; if automation is not set up, move it manually.
