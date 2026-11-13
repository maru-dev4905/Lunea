# Lunéa — Project Handoff v1.0

Lunéa (`lunea`, 루네아) is an AI-assisted emotional journal. This package is the planning and engineering handoff for Claude Code to establish the GitHub repository and prepare MVP development.

## Read order
1. `docs/00_PROJECT_CHARTER.md`
2. `docs/01_PRODUCT_BRIEF.md`
3. `docs/02_MVP_PRD.md`
4. `docs/03_UX_AND_USER_FLOWS.md`
5. `docs/04_VISUAL_DESIGN_SPEC.md`
6. `docs/05_TECHNICAL_ARCHITECTURE.md`
7. `docs/06_DATA_MODEL_AND_API.md`
8. `docs/07_AI_BEHAVIOR_AND_SAFETY.md`
9. `docs/08_ENGINEERING_AND_AI_WORKFLOW.md`
10. `docs/09_MVP_BACKLOG.md`
11. `docs/10_OPEN_DECISIONS.md`
12. `CLAUDE_HANDOFF_PROMPT.md`

After the handoff: `docs/STATUS.md` (current state), `docs/11_AGENT_WORKFLOW.md` (agent workflow), `docs/COMMANDS.md` (commands), `docs/adr/` (decisions), `docs/journal/` (decision history), `docs/lessons/` (lessons).

`Accepted` is binding. `Proposed` is a reversible default. `TBD` means Claude must ask, not silently decide. Human is product owner and final approver; Claude Code is primary developer; CodeRabbit is the current independent reviewer (Codex deferred, D-21).

Lunéa is not a diagnostic, treatment, crisis-response, or therapy replacement. AI suggests; the user decides. Original journal text must be preserved. No agent may merge to `main` or deploy production without explicit human approval.

## Develop (apps/mobile)
Expo + React Native + TypeScript app (ADR-0001). Node version: `.nvmrc`; package manager: npm.
```bash
# from the repository root
scripts/setup-worktree.sh   # npm ci (+ copy .env.local from the primary checkout in a new worktree)
scripts/check.sh            # format:check, lint, typecheck, test (same as CI)
cd apps/mobile
npm start                   # Expo dev server: press w for web, i/a for simulators, or scan the QR in Expo Go
npm run export              # ios + android + web bundle build used by CI
```
The Claude Code `Stop` hook (`scripts/stop-check.sh`) blocks ending a turn while `apps/mobile` changes fail `scripts/check.sh`.

## Supabase (supabase/)
Local stack needs Docker. PoC checks (RLS tests, Edge Function tests): `scripts/check-supabase.sh [--integration]`. Deno tools run through `npx deno@2.9.6` (no global install). Results and open items: `docs/poc/FND-04-supabase.md`.

