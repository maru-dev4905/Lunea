# 02 — MVP Product Requirements

## Goal
Deliver private mobile journaling with free-form writing, AI-assisted emotion exploration, explicit user confirmation, and record retrieval.

## Core user stories and acceptance criteria

### Account/onboarding
- User can sign up, sign in, sign out, and recover from auth errors.
- Before first AI analysis, user is told that journal text may be sent to an external AI provider.
- User understands AI suggestions can be wrong and are editable/rejectable.
- Auth tokens use platform-appropriate secure storage.

### Journal
- User can start writing without choosing a mood.
- Korean free-form text is supported.
- Empty/whitespace-only content cannot be submitted.
- Draft survives ordinary navigation and transient analysis failure.
- AI analysis is explicitly initiated by the user.

### AI interpretation
- Backend sends only necessary context to the selected provider.
- Response is validated against a versioned schema.
- Zero, one, or multiple emotion candidates are allowed.
- Every suggestion has evidence grounded in user text.
- AI confidence/uncertainty is distinct from emotion intensity.
- Invalid output is never saved as confirmed data.

### User review
- User can accept, edit, remove, add, or skip emotion candidates.
- Original wording remains available.
- User can save without choosing any emotion.
- AI-proposed and user-confirmed states are distinguishable.

### Records
- Explicit user action is required to save confirmed interpretation.
- User can browse records by date, open detail, edit, and delete.
- Server enforces ownership for every operation.
- Duplicate submissions are prevented or idempotent.

### Data controls
- Provide an understandable data deletion request route.
- Explain retention/backups only after actual policy is decided.
- Do not claim deletion is complete until backend confirms completion.

## State model
`draft → submitted → analysis_pending → analysis_ready → user_review → saved`
Alternative: `analysis_failed → retry | save_without_analysis`; `analysis_ready → skipped → saved`; `draft → discarded`.

Forbidden: AI success directly producing user-confirmed state without explicit user confirmation.

## Non-functional requirements
- All provider calls server-side; no API keys in app bundle.
- Server-side owner checks / RLS.
- No journal text in ordinary logs.
- Transport encryption and managed encrypted storage.
- Separate dev/staging/prod.
- AI failure must not destroy drafts.
- Archive pagination.
- Accessible labels, contrast, dynamic text where practical, reduced-motion support.
- Clear loading, error, offline, empty, and retry states.

## Release gates
Core flow works on iOS/Android test environments; critical unit/integration/E2E tests pass; cross-user access tests pass; AI schema/policy regression passes; user can reject suggestions; deletion behavior is verified; provider data handling is reviewed; human approves release.
