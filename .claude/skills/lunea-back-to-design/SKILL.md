---
name: lunea-back-to-design
description: Stop implementation variants and return the task to design — when the desired interaction cannot yet be described.
argument-hint: LUN-<number>
disable-model-invocation: true
---
# /lunea-back-to-design $ARGUMENTS

1. Close open variant PRs (keep branches as references).
2. Summarize in Korean on the Jira issue: what was tried, what was rejected and why, open questions.
3. Create or link a UX task (e.g. under UX-01/DS-01) asking for references (videos, sketches, competitor examples) and a written interaction spec.
4. Move `$ARGUMENTS` back to `해야 할 일`, remove `mode-*` labels, mark it blocked by the UX task.
5. Write a `docs/journal/` entry if the attempts revealed a design insight.
