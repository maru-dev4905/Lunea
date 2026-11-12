---
name: lunea-pick
description: Owner picks one compare variant; close the other and continue from the chosen one.
argument-hint: LUN-<number> <1|2>
disable-model-invocation: true
---
# /lunea-pick $ARGUMENTS

1. Parse task key and variant number from `$ARGUMENTS`.
2. Close the non-chosen draft PR with a Korean comment ("비교 라운드에서 미선택"); delete its branch only after the owner confirms.
3. Record the choice and the owner's reason (ask if not given) as a Jira comment and a `docs/journal/` note if the choice reflects a product/design decision.
4. Ask the owner whether to continue in mode A (`mode-seq`, refine the chosen branch) or mode C (`mode-parallel`, split into sub-tasks). Set the label accordingly.
5. Update `docs/STATUS.md`.
