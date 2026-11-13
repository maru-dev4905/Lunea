---
name: lunea-parallel
description: Run mode C — orchestrate parallel implementers for independent tasks, then an independent verifier per PR.
argument-hint: LUN-<a> LUN-<b> [...]
disable-model-invocation: true
---
# /lunea-parallel $ARGUMENTS

1. For each task, read Jira and estimate the files it will touch. Refuse to parallelize tasks that overlap files or touch `package.json`/lockfile, Supabase migrations, theme tokens, `CLAUDE.md`/`.claude/` — serialize those and say so.
2. Set label `mode-parallel` on each; move to `진행 중`.
3. Spawn one Orca implementer per task (`orca worktree create …`; confirm syntax with `orca --help`), each branched from latest `dev` with its PR into `dev`, told to follow steps 3–6 of `.claude/skills/lunea-seq/SKILL.md` **except** updating `docs/STATUS.md` (implementers report results only; the orchestrator updates `docs/STATUS.md` once after collecting results, avoiding merge conflicts).
4. When an implementer reports its final push (head SHA), spawn a fresh verifier worker running `/lunea-verify <PR> <head SHA>`.
5. Collect results; update `docs/STATUS.md`; report to the owner in Korean.
