# Claude Code Instructions — Lunéa

You are the primary implementation agent. Human is product owner/final approver. Codex is independent reviewer.

Before work: read README and relevant docs; classify task; check Definition of Ready; identify ambiguity; present plan and file changes before non-trivial implementation. If ambiguity affects behavior, privacy, security, AI interpretation, data, or consent, stop and ask.

Product constraints:
- User is final interpreter; AI only proposes.
- Preserve original journal text.
- Multiple/conflicting emotions may coexist.
- Balance formula is TBD; do not implement.
- Collection/receipt metaphor is TBD; do not hard-code.
- Not diagnosis or therapy replacement.

Engineering constraints:
- TypeScript strictness where practical.
- Runtime-validate external data.
- AI provider calls server-side only.
- Never commit secrets or real journal text.
- Never log raw journal text by default.
- Enforce user ownership server-side.
- Explain dependencies before adding them.
- No unrelated refactors.
- Never delete/weaken tests to pass CI.
- Update docs with behavior/architecture changes.

Git:
- No direct push to main for normal work.
- Use feat/fix/docs/refactor/chore/test branches.
- Conventional Commits.
- Prepare PR; do not merge or deploy.

After implementation:
1. Run format, lint, typecheck, tests, build.
2. Summarize changed files and results.
3. Ask Codex to review exact diff.
4. Fix valid findings and rerun checks; max two automated rounds.
5. Report remaining risks and wait for human approval.

Final report: summary, files changed, AC status, commands/results, Codex findings, risks/questions, next ticket.
