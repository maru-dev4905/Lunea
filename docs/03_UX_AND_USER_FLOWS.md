# 03 — UX Specification

## Experience principles
Quiet, intimate, non-judgmental. Writing begins before categorization. AI feels like a thoughtful companion, not an interviewer. Ask one question at a time. User can skip, edit, reject, or leave. No guilt for not recording.

## Proposed navigation
- Today: start/continue a record.
- Collection: browse past records.
- Settings: account, privacy, AI processing, data controls.
This is a proposal, not final IA. No stats/social/AI-chat tabs in MVP without approval.

Low-fi wireframes and the core flow diagram for these screens are in `docs/03a_WIREFRAMES.md` (LUN-14). Emotion review and Save feedback are marked there as compare targets (mode B candidates). Keep the two files consistent.

## Primary flow
1. Open Today.
2. Start a record.
3. Write freely.
4. Explicitly request AI assistance (optional: the user may save without AI, D-32).
5. Show calm progress state.
6. Clarification question: Deferred (D-15). The MVP asks none; the flow goes from the progress state (step 5) straight to the candidates (step 7).
7. Show event/emotion candidates with evidence.
8. User accepts, edits, removes, or adds labels.
9. Show what will be saved.
10. User explicitly confirms.
11. Open saved detail; record appears in Collection.

## Screen behavior
### Today
Clear entry point, no mandatory daily completion, no guilt copy. The Today screen itself shows no streak or score; a streak and prices appear only on the receipt (D-37, see the Receipt economy in docs/01; prototype on synthetic data).

### Journal editor
Comfortable long-form input; no mandatory emotion selection; preserve draft on transient errors; disclose AI processing before sending text.

### Clarification (Deferred, D-15)
Not part of the MVP. Kept below as the reference for a later revisit.

One question at a time, grounded in user words, never leading or inventing details. Skip is always available.

### Emotion review
Show label, optional plain-language description, evidence snippet, optional user-confirmed intensity only if scale is approved, and uncertainty separately. Actions: accept/edit/remove/add/skip all. Do not show confidence as a percentage by default.

### Save
Clearly distinguish original text, AI-generated summary, and user-confirmed labels. Explicit save action required.

Plain save without AI (LUN-21, D-32): Save in the editor stores the text exactly as typed, with no emotion step, clears the draft and opens the saved record's Detail. Save is idempotent (a double tap makes one record). Save feedback is one calm line ("저장했어요."), shown once on arrival at Detail with a single hairline that draws itself (static under reduced motion) and a screen-reader announcement; no points, streaks or praise. The feedback placement is still a compare target (docs/03a §5); this is the baseline. Records are kept in memory only (ADR-0003) and vanish when the app closes.

### Collection/detail
Date-ordered list with short preview; pagination. Original writing remains accessible. Empty Collection: one calm line and a way to start a record, with no guilt or streak wording. Several records on one day are separate items, newest first (D-14 grouping is TBD). Confirmed interpretation is primary. Clearly label AI-derived content. Edit/delete are discoverable. No forced receipt-like layout.

### Settings
Account/session, AI/privacy explanation, data export/delete entry points when implemented.

## Edge cases
Short/ambiguous entry; no explicit emotion words; multiple events; conflicting feelings; all suggestions rejected; zero candidates; network failure; app closed during analysis; duplicate save; edits during analysis; deletion with pending analysis.

## Copy examples
Preferred: “이런 감정도 있었을까?”, “내가 이해한 내용이 맞는지 확인해 줘.”, “다른 표현으로 바꿔도 괜찮아.”, “지금은 잘 모르겠다면 넘어가도 좋아.”
Avoid: “당신은 분명히 우울합니다.”, “오늘의 감정 점수는 42점입니다.”, “연속 기록이 끊겼어요!”, “AI가 당신의 진짜 감정을 분석했습니다.”

## UX acceptance
User can write before choosing an emotion, skip AI, preserve mixed emotions, edit/reject all suggestions, access original text, explicitly save, and use the app with reduced motion and assistive technologies.
