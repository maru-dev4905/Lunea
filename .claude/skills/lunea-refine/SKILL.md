---
name: lunea-refine
description: One compare variant is close — switch to mode A and refine that variant with the owner's feedback.
argument-hint: LUN-<number> <1|2> "<feedback>"
disable-model-invocation: true
---
# /lunea-refine $ARGUMENTS

1. Close the other variant's draft PR (comment why).
2. Set Jira label `mode-seq`; comment the feedback.
3. Continue on the chosen branch: apply the feedback, keep reduced-motion parity, refresh the preview.
4. Finish with `/lunea-finish` (mark the PR ready for review when done).
