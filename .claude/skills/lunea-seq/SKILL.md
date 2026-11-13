---
name: lunea-seq
description: Start or continue a Jira task in mode A (sequential, one implementer). Invoked by the owner with a task key.
argument-hint: LUN-<number>
disable-model-invocation: true
---
# /lunea-seq $ARGUMENTS

Mode A — one implementer, Superpowers flow.

1. Read `CLAUDE.md`, `docs/STATUS.md`, `docs/lessons/README.md`, and Jira `$ARGUMENTS` (acceptance criteria, links).
2. Set the Jira label to `mode-seq` (remove other `mode-*` labels). Move the issue to `진행 중`.
3. Create/checkout branch `<type>/$ARGUMENTS-<short-desc>` from latest `dev` (PR base: `dev`, D-26). Not for hotfixes — those branch from `main` (`docs/11_AGENT_WORKFLOW.md` §5a).
4. Present plan + file list in Korean. Wait for approval if the change touches behavior, privacy, security, AI interpretation, data or consent (CLAUDE.md).
5. Implement test-first (write failing test → implement → pass).
6. Finish by following `.claude/skills/lunea-finish/SKILL.md` (checks, PR, records, push, request independent verification).
