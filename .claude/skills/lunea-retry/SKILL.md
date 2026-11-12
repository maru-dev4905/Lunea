---
name: lunea-retry
description: Both compare variants rejected — run a new compare round incorporating the owner's feedback (max 2 rounds total).
argument-hint: LUN-<number> "<feedback>"
disable-model-invocation: true
---
# /lunea-retry $ARGUMENTS

1. Record the feedback as a Jira comment ("라운드 N 피드백: …"), including what was disliked in each variant.
2. If round 2 is already done, do not start round 3: propose `/lunea-back-to-design` and stop.
3. Close both previous draft PRs (keep branches until the owner confirms deletion; they are references).
4. Follow the steps in `.claude/skills/lunea-compare/SKILL.md` for round 2 (branches `-r2-v1`, `-r2-v2`), with the feedback as a hard constraint for both new variants.
