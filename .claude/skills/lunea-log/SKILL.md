---
name: lunea-log
description: Write an engineering journal entry (portfolio-grade decision narrative) from the current discussion — background, options considered, decision and reasons, outcome.
argument-hint: "<topic>"
disable-model-invocation: true
---
# /lunea-log $ARGUMENTS

1. Create `docs/journal/YYYY-MM-DD-<slug>.md` using the template in `docs/journal/README.md`. Write in Korean.
2. Be factual: cite PRs, commits, ADRs, Jira keys, reviewer findings. Do not invent numbers or quotes. Mark anything uncertain as such.
3. Include the options table with real trade-offs and the constraints that drove the decision.
4. Add the entry to the timeline in `docs/journal/README.md`.
5. Show the draft to the owner for edits before committing — it is the owner's portfolio voice.
