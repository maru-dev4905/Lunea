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
4. Update `docs/STATUS.md` **in Korean** (완료 / 검토 중 / 다음 작업 / 제품 책임자 확인 필요) — the owner reads it to check what the AI understands — **skip this in mode C**; the orchestrator updates it.
5. Commit and push the journal/lesson/STATUS changes to the PR branch; confirm they appear in the PR diff. Report the final head commit SHA.
6. Independent verification (Definition of Done layer 6) starts **only after step 5's final push**, against that head SHA: in mode C the orchestrator spawns the Verifier with `/lunea-verify <PR> <head SHA>`; in mode A, ask the owner to run `/lunea-verify <PR> <head SHA>` (SHA optional; omitted = current PR head) in a **fresh** session (D-25: in mode A the owner starts it). Never verify your own PR. If new commits are pushed after verification starts, verification must be repeated for the new head.
7. Do not merge. Jira moves to `검토 중` by automation; if automation is not set up, move it manually.
8. Cloud sessions cannot delete branches or change repository settings (lesson L-001). Do not attempt it; list branch cleanup and settings changes as owner steps in the report.
