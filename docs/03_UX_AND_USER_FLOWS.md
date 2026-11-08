# 03 — UX Specification

## Experience principles
Quiet, intimate, non-judgmental. Writing begins before categorization. AI feels like a thoughtful companion, not an interviewer. Ask one question at a time. User can skip, edit, reject, or leave. No guilt for not recording.

## Proposed navigation
- Today: start/continue a record.
- Collection: browse past records.
- Settings: account, privacy, AI processing, data controls.
This is a proposal, not final IA. No stats/social/AI-chat tabs in MVP without approval.

## Primary flow
1. Open Today.
2. Start a record.
3. Write freely.
4. Explicitly request AI assistance.
5. Show calm progress state.
6. Optionally ask one clarification question; user may skip.
7. Show event/emotion candidates with evidence.
8. User accepts, edits, removes, or adds labels.
9. Show what will be saved.
10. User explicitly confirms.
11. Open saved detail; record appears in Collection.

## Screen behavior
### Today
Clear entry point, no mandatory daily completion, no streaks, no mood score, no guilt copy.

### Journal editor
Comfortable long-form input; no mandatory emotion selection; preserve draft on transient errors; disclose AI processing before sending text.

### Clarification
One question at a time, grounded in user words, never leading or inventing details. Skip is always available.

### Emotion review
Show label, optional plain-language description, evidence snippet, optional user-confirmed intensity only if scale is approved, and uncertainty separately. Actions: accept/edit/remove/add/skip all. Do not show confidence as a percentage by default.

### Save
Clearly distinguish original text, AI-generated summary, and user-confirmed labels. Explicit save action required.

### Collection/detail
Date-ordered list with short preview; pagination. Original writing remains accessible. Confirmed interpretation is primary. Clearly label AI-derived content. Edit/delete are discoverable. No forced receipt-like layout.

### Settings
Account/session, AI/privacy explanation, data export/delete entry points when implemented.

## Edge cases
Short/ambiguous entry; no explicit emotion words; multiple events; conflicting feelings; all suggestions rejected; zero candidates; skipped clarification; network failure; app closed during analysis; duplicate save; edits during analysis; deletion with pending analysis.

## Copy examples
Preferred: “이런 감정도 있었을까?”, “내가 이해한 내용이 맞는지 확인해 줘.”, “다른 표현으로 바꿔도 괜찮아.”, “지금은 잘 모르겠다면 넘어가도 좋아.”
Avoid: “당신은 분명히 우울합니다.”, “오늘의 감정 점수는 42점입니다.”, “연속 기록이 끊겼어요!”, “AI가 당신의 진짜 감정을 분석했습니다.”

## UX acceptance
User can write before choosing an emotion, skip AI, preserve mixed emotions, edit/reject all suggestions, access original text, explicitly save, and use the app with reduced motion and assistive technologies.
