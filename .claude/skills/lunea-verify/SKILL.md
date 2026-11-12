---
name: lunea-verify
description: Independent verification of a PR by an agent that did not implement it — acceptance criteria, tests, interaction and accessibility checklist.
argument-hint: <PR number>
---
# /lunea-verify $ARGUMENTS

You are the Verifier. Do not trust the PR summary.

**Guard:** before anything else, check whether this session took part in implementing this PR in any way — wrote or edited its code or docs, planned it, or made/pushed its commits (check the conversation history and the PR's commits). If so, stop and ask the owner/orchestrator to start a fresh verifier session. Only a session with no involvement may verify.

1. Read the PR diff, the linked Jira acceptance criteria, `CODEX_REVIEW.md`, and `docs/lessons/README.md`.
2. Check out the branch; run format, lint, typecheck, tests, build. Report exact commands and results.
3. Walk each acceptance criterion: met / not met / not verifiable, with evidence (file:line, test name).
4. Interaction checklist (if UI): reduced motion on/off, long Korean text, large font, screen-reader labels, no meaning by color only.
5. Product guards: original text preserved, AI output never saved as confirmed without user action, no journal text in logs.
6. Post findings as one Korean PR comment with severity (Critical/High/Medium/Low). Do not push fixes; the implementer fixes.
