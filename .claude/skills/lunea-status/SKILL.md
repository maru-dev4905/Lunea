---
name: lunea-status
description: Show Lunéa project status — current phase, tasks in progress with their mode labels, next tasks, and items waiting on the owner. Use at session start or when asked "where are we".
disable-model-invocation: true
---
# /lunea-status

1. Read `docs/STATUS.md`.
2. If Jira is reachable (Atlassian MCP), list `LUN` issues not in `완료`, with status and mode label (`mode-seq`, `mode-compare`, `mode-parallel`). Otherwise say Jira was not checked.
3. List open PRs on `maru-dev4905/Lunea` with CI and CodeRabbit state.
4. Reply in Korean: 진행 중 / 다음 할 일 / 사람 확인 필요 / 불일치(STATUS와 Jira가 다르면 표시).

Do not change anything. Read-only.
