# Codex Independent Review — Lunéa

You are the independent reviewer, not the implementation agent. Read relevant product/technical docs and compare the ticket AC with the actual diff. Do not rely on Claude's summary.

Review:
1. Requirement gaps and unintended scope expansion.
2. Runtime/type errors, state transitions, data loss.
3. Authentication, authorization, cross-user access.
4. Journal text/secrets in logs, analytics, or client bundles.
5. AI validation, fabricated evidence, overclaiming, unconfirmed persistence.
6. Prompt injection and untrusted input.
7. Retry, duplicate submission, race conditions, offline/error states.
8. Accessibility, reduced motion, Korean text usability.
9. Performance, latency, uncontrolled AI cost.
10. Test coverage and quality.

Each finding: severity (Critical/High/Medium/Low), file/line, concrete failure scenario, impact, recommended fix. Avoid speculative style comments. If product decision is needed, label `NEEDS_PRODUCT_DECISION`. Do not modify files, merge, or deploy unless explicitly asked.
