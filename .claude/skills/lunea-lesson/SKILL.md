---
name: lunea-lesson
description: Record a lesson after an agent mistake, valid reviewer finding, CI failure or harness error — symptom, cause, fix, prevention, defense level. Also use when an error matches an existing lesson.
argument-hint: "<short title>"
---
# /lunea-lesson $ARGUMENTS

1. Search `docs/lessons/README.md` keywords. If a matching lesson exists: apply its fix, add the recurrence to it, and raise its defense level by one (L0→L1→L2→L3). Stop here.
2. Otherwise create `docs/lessons/L-NNN-<slug>.md` from the template in `docs/lessons/README.md` (Korean body, English keywords + Korean keywords).
3. Choose the highest feasible defense level now: L3 (test/lint/hook/CI) > L2 (skill step) > L1 (CLAUDE.md line) > L0.
4. Add the row to the index table in `docs/lessons/README.md`.
