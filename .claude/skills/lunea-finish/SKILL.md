---
name: lunea-finish
description: Finish a task — run checks, open the Korean PR, capture decisions/lessons, update STATUS. Use at the end of any implementation task.
---
# /lunea-finish

1. Run format, lint, typecheck, tests, build (whatever exists). Do not claim success for checks not run.
2. Open/refresh a non-draft PR in Korean using `.github/pull_request_template.md`, linking the Jira key.
3. Ask yourself, and answer in the PR under "결정 기록 / 교훈":
   - Was there a choice between options? → add/extend a `docs/journal/` entry (`/lunea-log`).
   - Was there a mistake, rollback, or valid reviewer finding caused by an agent? → add a lesson (`/lunea-lesson`).
4. Update `docs/STATUS.md` (Done / Next / Waiting on owner).
5. Do not merge. Jira moves to `검토 중` by automation; if automation is not set up, move it manually.
