# 11 — Agent Workflow (Orca + Claude Code)

Status: Accepted (2026-11-12, product owner). Supersedes the tool guidance in `08` where they differ.

## 1. Tooling decisions

| Tool | Decision | Notes |
|---|---|---|
| Orca | **Adopted** — outer orchestration: one git worktree per task | Runs on the owner's machine (or remote/cloud VM). Merge is plain git/PR. |
| Superpowers (Claude Code plugin) | **Adopted** — working method (brainstorm → plan → TDD → verify) | Declared in `.claude/settings.json`. |
| pstack | **Removed** | Overlaps Superpowers; unclear provenance. |
| OMC (oh-my-claudecode) | **Not used** | Overlaps Orca's orchestration role. |
| CodeRabbit | **Only external reviewer** | See D-21. |
| Codex | **Deferred** | Added once the service is substantially built; the review pipeline is then redesigned (Codex replaces/joins the Verifier role). |
| n8n, LangChain | **Deferred to service development** | Possible RAG over journal data → D-22 (privacy decision required first). |
| Mode D (label → GitHub Actions Claude → PR) | **Deferred** | Cost (API usage) to be evaluated first. |

## 2. Memory model — files, not agents

No agent session remembers the project across sessions. Every agent rebuilds context from files at start and writes back at the end.

| Memory | Location | Written by |
|---|---|---|
| Rules | `CLAUDE.md` | Human approval |
| Product/technical spec | `docs/00`–`docs/11` | PRs |
| Decisions | `docs/adr/` | PRs, owner accepts |
| Current state, next work (written in Korean: the owner checks what the AI understands) | `docs/STATUS.md` | Orchestrator / every finishing agent |
| Lessons (mistakes → prevention) | `docs/lessons/` | `/lunea-lesson`, finish step |
| Narrative decision history | `docs/journal/` | `/lunea-log`, finish step |
| Work items | Jira `LUN` (`iseung10e.atlassian.net`) | Orchestrator, automation |
| Delivered work | GitHub PRs | Implementers |

## 3. Roles

| Role | Runs as | Responsibility |
|---|---|---|
| Orchestrator | The main Claude session in Orca | Read memory, pick next Jira task, plan, spawn workers, collect results, update `STATUS.md`, ask owner for approvals |
| Implementer | Orca worker in its own worktree | One task → implement → checks → Korean PR |
| Verifier | Separate fresh worker (never the implementer) | Check PR against acceptance criteria, rerun tests, interaction checklist, reduced motion. Codex may take this seat later. |
| CodeRabbit | GitHub App | External review on every non-draft PR |
| Automation | GitHub for Jira + Jira automation + Slack apps | Jira transitions and notifications (not an AI) |
| Owner (human) | — | Approve consequential plans, pick compare variants, real-device check, merge |

Jira transitions are automated, not done by an agent: PR opened → `검토 중`, PR merged → `완료`.

## 4. Modes

| Mode | Label | When | Owner does |
|---|---|---|---|
| A. Sequential | `mode-seq` | Foundation work (FND-02, FND-04, …); refining one chosen variant | Approve plan, merge |
| B. Compare | `mode-compare` | Interaction-heavy UI (emotion review, save motion, …) | Pick variant 1 or 2 via device previews |
| C. Parallel + verify | `mode-parallel` | Detailed implementation after direction is fixed; independent features | Merge |
| D. Fully automatic | `auto-pr` | Deferred (cost) | — |

### Switching rules after a compare round

| Situation | Command | Result |
|---|---|---|
| One variant is right | `/lunea-pick LUN-x 1` | Continue from variant 1 (A or C) |
| Both wrong direction | `/lunea-retry LUN-x "feedback"` | New compare round with feedback |
| One is close, needs tuning | `/lunea-refine LUN-x 1 "feedback"` | Switch to A on variant 1 |
| Cannot describe what is wanted | `/lunea-back-to-design LUN-x` | Return to UX/design task |

Compare rounds are limited to **2**. After round 2 the orchestrator proposes `/lunea-back-to-design` instead of a third round (compare costs ~2×).

The current mode is recorded as a Jira label and in `docs/STATUS.md`, so it survives session changes.

## 5. Parallel safety

1. One task = one worktree = one branch (`feat/LUN-xx-…`) = one PR.
2. Never run in parallel: changes to `package.json`/lockfile, Supabase migrations, shared theme tokens, `CLAUDE.md`/`.claude/`. Serialize these.
3. Parallelize only tasks with disjoint file sets.
4. Secrets (`.env.local`) are not in git; a worktree setup script (added in FND-02) copies them from the primary checkout.

## 6. Session protocol (every agent)

Start:
1. Read `CLAUDE.md`, `docs/STATUS.md`, `docs/lessons/README.md` (the SessionStart hook prints the lessons index).
2. Read the Jira task and linked docs/ADRs.
3. Present plan and file list; wait for approval when the change is consequential.

On any error, reviewer finding, or CI failure: search `docs/lessons/README.md` keywords first. If a lesson exists, follow it and raise its defense level.

Finish (`/lunea-finish`):
1. Run checks; open Korean PR.
2. Answer: was there a decision between options? a mistake or rollback? → add journal entry / lesson in the same PR.
3. Update `docs/STATUS.md`.

## 7. Defense levels for lessons

| Level | Form | Strength |
|---|---|---|
| L0 | Lesson document only | Weak |
| L1 | One-line rule in `CLAUDE.md` | Read every session |
| L2 | Skill/checklist step | Part of the procedure |
| L3 | Automated check (test, lint, hook, CI) | Enforced |

A lesson that recurs must move up at least one level.

## 8. Verification layers (Definition of Done)

1. TypeScript strict, ESLint, Prettier
2. Tests first (TDD): see the test fail, then implement
3. Integration: RLS cross-user tests, AI output schema tests
4. Maestro E2E with recording (after core flow exists)
5. AI evaluation set (AI-05)
6. Independent Verifier + CodeRabbit (Codex later). Who starts the Verifier (D-25): mode A — the owner runs `/lunea-verify <PR> [head SHA]` in a fresh session after the final push; mode C — the orchestrator spawns it automatically. In both modes verification checks out the final pushed head SHA (passed as the second argument, or the PR head at start when omitted; a mismatch with the PR head stops verification) and records it in the report; any later push requires re-verification on the new head. Revisit (switch mode A to automatic) once an orchestrator session is used routinely.
7. Real-device check via preview QR (owner)
8. Branch protection + human merge

Layers 1–5 become required CI checks progressively from FND-02.

## 9. Owner one-time setup (local machine)

- Orca desktop app; select Claude Code as the agent; connect GitHub; pair the mobile app for input notifications.
- Claude Code: trust the repo so `.claude/settings.json` applies; accept the Superpowers plugin install prompt (or run the commands in `docs/COMMANDS.md`).
- Atlassian MCP for Claude Code (Jira `LUN` access) — see `docs/COMMANDS.md`.
- Jira automation rules: PR created → `검토 중`; PR merged → `완료` (requires the GitHub for Jira app).
