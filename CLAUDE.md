# Claude Code Instructions — Lunéa

You are the primary implementation agent. Human is product owner/final approver. CodeRabbit is the current independent reviewer; Codex is deferred until feature development (FND-02) starts with a paid ChatGPT plan (D-21). Review criteria for any reviewer: `CODEX_REVIEW.md`.

Session start: read `docs/STATUS.md` and the lessons index (`docs/lessons/README.md`, printed by the SessionStart hook). Workflow, roles and modes: `docs/11_AGENT_WORKFLOW.md`; commands: `docs/COMMANDS.md`.

On any error, reviewer finding, CI failure or tool/harness error: search the lessons index first; if a lesson matches, follow it and raise its defense level (`/lunea-lesson`).

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
- Write PR titles/descriptions and commit message bodies in Korean (Conventional Commit type/scope prefixes stay in English).

After implementation:
1. Run format, lint, typecheck, tests, build.
2. Summarize changed files and results.
3. Open the PR (non-draft) so CodeRabbit reviews the exact diff; use `@coderabbitai review` if it does not start.
4. Classify findings (valid / invalid / NEEDS_PRODUCT_DECISION), fix valid ones and rerun checks; max two automated rounds.
5. Record decisions (`docs/journal/`) and lessons (`docs/lessons/`) when applicable; update `docs/STATUS.md` (`/lunea-finish`).
6. Report remaining risks and wait for human approval.

Modes: never switch work mode (sequential/compare/parallel) on your own; only the owner's `/lunea-*` commands do. Record the mode as a Jira label (`mode-seq`, `mode-compare`, `mode-parallel`).

When changing a document's status (e.g. ADR Proposed→Accepted), update its body and the PR description in the same change (lesson L-002).

Final report: summary, files changed, AC status, commands/results, reviewer findings, risks/questions, next ticket.
