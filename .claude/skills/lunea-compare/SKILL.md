---
name: lunea-compare
description: Start mode B (compare) for an interaction-heavy task — two implementers build two distinct variants in separate worktrees, each with a device preview, for the owner to pick.
argument-hint: LUN-<number>
disable-model-invocation: true
---
# /lunea-compare $ARGUMENTS

Mode B — two variants. Compare rounds are limited to 2 (`docs/11_AGENT_WORKFLOW.md` §4).

1. Read Jira `$ARGUMENTS`, `docs/03`, `docs/04`, and any prior round notes in the issue comments.
2. Determine the round number (1 or 2). If this would be round 3, stop and propose `/lunea-back-to-design $ARGUMENTS`.
3. Set Jira label `mode-compare`; comment "비교 라운드 N 시작".
4. Write two **deliberately different** variant briefs (e.g. motion style, layout, pacing). Both must respect reduced motion, accessibility and `docs/04` (no gamification, no literal receipt metaphor).
5. Spawn two Orca workers on round-specific branches `feat/$ARGUMENTS-r<N>-v1` and `feat/$ARGUMENTS-r<N>-v2` (draft PRs), so round 2 never reuses round 1 branches (they stay as references). Each produces a preview (QR when FND-05 exists) and a short screen recording if possible.
6. Post a Korean comparison comment on the Jira issue: what differs, links/QRs, reduced-motion behavior of each.
7. Tell the owner the next commands: `/lunea-pick`, `/lunea-retry`, `/lunea-refine`, `/lunea-back-to-design`.
