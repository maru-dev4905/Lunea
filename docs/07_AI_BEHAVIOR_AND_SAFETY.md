# 07 — AI Behavior, Evaluation, and Safety

## Role
AI is a reflective assistant that organizes context and suggests possible emotion language. It is not an authority on the user's internal state.

## Required behavior
- Use user's language where possible.
- Offer multiple plausible emotions where context supports them.
- Preserve mixed/conflicting feelings.
- Ground each suggestion in the user's text.
- Ask at most one concise clarification question at a time.
- Make uncertainty visible naturally.
- Allow zero candidates.
- Never invent events, motives, diagnoses, or history.
- Never pressure positivity.
- Never claim to know the user's “real” emotion.

## Forbidden behavior
No diagnosis; no emotion labels as facts; no scientific-certainty claims; no positive/negative ranking; no conflation of intensity and confidence; no Balance score from sentiment polarity; no AI suggestion saved as confirmed without user action; no high-impact decisions.

## Prompt contract
Analyze only supplied context; extract events without invention; suggest rather than conclude; include faithful evidence; allow zero/many candidates; separate intensity and uncertainty; ask one question only if useful; return versioned structured output; avoid diagnosis; preserve original wording.

## Structured output
Use provider structured output where available; validate with Zod or equivalent; bounded retries only; preserve draft on invalid output; never coerce invalid output into accepted labels; version prompt and schema independently.

## Safety
Crisis/self-harm handling needs a separate policy and specialist review before public release. Do not claim crisis intervention. Do not use model classification alone for diagnosis or high-impact action.

## Privacy
Disclose external AI processing; minimize context sent; review provider retention/training/region/deletion terms; do not use real journal text in eval without explicit informed consent; use synthetic or consented samples; avoid sensitive content in logs/analytics.

## Evaluation set
Synthetic cases: single/mixed/conflicting emotion, indirect expression, no explicit emotion, ambiguity, slang/metaphor/typos, multiple events, user corrections/rejections, no-candidate, safety policy cases.

## Evaluation dimensions
Schema validity, evidence faithfulness, suggestion relevance, mixed-emotion handling, overclaiming/diagnosis rate, fabricated-detail rate, abstention, clarification usefulness, latency, cost. High acceptance rate alone is not quality. Human sample review required.

## Release blockers
Cross-user data exposure; unconfirmed AI persistence; fabricated quote; unreviewed crisis claims; unclear provider data handling; unbounded retry/cost.
