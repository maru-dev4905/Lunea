# 08 — Engineering, GitHub, and AI Workflow

## Roles
- Human: product owner, final authority.
- Claude Code: primary developer; repository setup, implementation, tests, docs, PR prep.
- Codex: independent reviewer; no merge authority.
- CodeRabbit: optional additional PR review.
- GitHub Actions: mechanical quality gate.
- Orca CLI: optional outer orchestration/worktree tool, only when parallelism is needed.

## Loop
Jira issue → requirement clarification/DoR → Claude plan → human approval for consequential work → Claude feature branch implementation → lint/typecheck/tests/build → Codex review → Claude fixes valid findings → re-run checks → PR + CodeRabbit + CI → human review → human merge.

## Definition of Ready
Ticket needs purpose, user story, scope/non-scope, testable acceptance criteria, edge cases, dependencies, privacy/security/AI impact, test plan, and open questions. If ambiguity changes product behavior, data, privacy, AI interpretation, or consent, Claude must stop and ask.

## Branch strategy
Trunk-based; no permanent `develop` branch initially.
- `main` protected.
- `feat/LUN-123-short-description`
- `fix/LUN-123-short-description`
- `docs/LUN-123-short-description`
- `refactor/LUN-123-short-description`
- `chore/LUN-123-short-description`
- `test/LUN-123-short-description`
If Jira is not configured, do not invent ticket IDs; use a descriptive bootstrap branch.

## Commits
Conventional Commits: `<type>(<scope>): <imperative description>`.
Examples: `feat(journal): add draft composer`, `fix(ai): reject malformed candidates`, `test(records): cover owner authorization`.
Never commit secrets, real journal text, production data, or unnecessary binaries.

## PR rules
No direct push to main for normal work. PR links Jira issue when available and includes summary, rationale, AC, validation, risks, screenshots for UI, migration notes. Critical/High findings block merge. Human inspects diff and approves. No auto-merge or agent-led production deploy.

## Codex protocol
Give Codex ticket, AC, relevant docs, exact diff, test output. Review requirement gaps, runtime/type errors, auth/ownership, privacy/logging, prompt injection, invalid AI persistence, race/retry, accessibility/reduced motion, performance/cost, and test quality. Each finding includes severity, file/line, concrete scenario, and fix. Avoid speculative style-only comments.

## Fix loop
Claude classifies finding as valid/invalid/needs product decision. Fix valid issues, ask human for product decisions, rerun tests. Default max two automated rounds; then surface unresolved items.

## Tool guidance
pstack/Superpowers can provide clarification, architecture, TDD, verification playbooks. Avoid overlapping skill packs issuing conflicting instructions. Orca is outer worktree/task orchestration; OMC is optional Claude-internal orchestration. Start with one Claude task and one Codex review. Manual approval for shell commands, dependencies, migrations, secrets, destructive operations. n8n and LangChain are not required initially without a concrete need.

## GitHub setup checklist
- Create private `lunea` repo (recommend private initially; ask before public).
- Add docs, README, `.gitignore`, `.editorconfig`, license decision.
- Protect main; require PR and CI; disable force push/deletion.
- Add issue/PR templates and GitHub Actions.
- Enable secret scanning/push protection and dependency updates if available.
- Connect Jira if configured.
- Add Claude/Codex instructions.
- First short-lived branch only after scaffold plan approval.

## CI minimum
Lockfile install, formatting, lint, typecheck, unit tests, build, dependency/security check where practical. Never delete tests or weaken checks merely to turn CI green.

## Human approval required
Product scope; emotion interpretation/Balance; analytics of journal content or sensitive inferences; auth/RLS/encryption/retention/deletion; new external processors; data migrations; production data/secrets; merge/deploy.
