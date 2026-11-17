# 01 — Product Brief

## Summary
Lunéa is an AI-assisted emotional journal. Users describe events and thoughts in natural language. AI helps identify event context and possible emotions; users confirm or change the interpretation. Records can later be revisited for self-understanding.

**One-line description:** A quiet space to understand what you felt, in your own words.

## Problem hypotheses
- People can describe an event but struggle to name the emotions around it.
- One event may involve relief, pride, disappointment, anxiety, affection, and emptiness at once.
- Blank-page journaling can feel demanding.
- Existing notes can be hard to revisit meaningfully.
- Single-mood or positive/negative tools can oversimplify experience.
- Users may distrust AI that confidently labels feelings they did not express.

These are hypotheses, not established market facts.

## Initial user hypothesis
People who want to reflect on everyday experiences, sometimes have mixed or hard-to-name emotions, prefer a guided starting point, and want help without surrendering interpretive control.

## Jobs to be done
- Help me put an emotionally meaningful event into words.
- Offer possible language when I cannot name what I feel.
- Preserve multiple feelings at once.
- Help me revisit context, not just a mood label.
- Let me correct my own record later.

## Product principles
- User is the final interpreter.
- Multiple emotions can coexist.
- Original text remains intact and separate from derived summaries.
- AI can abstain; uncertainty is not a failure.
- Reflection is not performance; no guilt mechanics.

## Balance
Balance is a selected product concept: a person's perceived sense of balance among themselves, their emotions, and their circumstances. It is NOT happiness, positivity ratio, productivity, diagnosis, or an objective judgment of a day. Formula, scale, input method, visibility, and MVP inclusion are **TBD**. Do not implement a numerical score until the product owner approves a definition and validation plan.

## Collection
Collection is a selected direction for how records accumulate and are revisited. A receipt-like look is provisionally accepted (D-12, D-35) and the receipt economy below is decided in principle (D-37). Exact IA stays **TBD**. Collectible objects and badges are not approved. Keep the receipt inside `src/receipt` and `app/receipt`.

## Receipt economy (D-37, decided 2026-11-17)
Decided with the owner, one question at a time. All numbers in the prototype are synthetic; none of this computes a price from the text (D-11 stays TBD, and a receipt total is not a Balance score).
1. **Price = the size of a feeling.** How big the feeling felt today, so two different feelings can cost the same and nothing is ranked good or bad. The length or effort of the writing never changes a price. If an entry is short, the app may offer an optional, gentle prompt to add more; a chat-style question flow is a separate decision (D-15, deferred).
2. **The user picks the size** for each feeling when confirming it (for example steps 1 to 5, with a default). AI does not decide it (AI only proposes, the user is the final interpreter).
3. **Every feeling deposits the same way and a deposit never decreases.** Tiring or anxious feelings count the same as pleasant ones. Nothing is ever taken away.
4. **Streak with rest tickets.** Recording earns rest tickets (separate from the balance, so the balance never drops). A missed day uses a ticket automatically and the streak continues. With no ticket the streak resets; the wording must be warm ("continue", not "start over", no loss or shame wording).
5. **The balance unlocks look-back receipts.** When the balance reaches certain amounts, a weekly or monthly look-back receipt opens. The original writing is always readable regardless of balance; only the gathered look-back is unlocked. What a look-back contains is a separate decision, because it needs AI wording.
6. **One receipt per saved entry.** Several entries in a day give several receipts. Today's deposit and the streak's "day" need a per-day rule once D-14 is decided.
7. **Unit.** Won for now. Other countries get their own currency when languages are added, so the app will need a country or currency (prefer the device locale, changeable by the user, over asking at sign-up). Proposal, not decided (settle in the data model work, PRIV-01): store an internal unitless integer and format it per currency, so unlock thresholds do not change with the country. Because it looks like money, the receipt must say it is not real money.
8. **Sharing is a user-made image export,** never a public feed (out of scope in the charter). The user previews it and chooses what appears; the event and quotes are hidden by default, so only feeling names and amounts show.

Still open: the size scale and amount per size, ticket and unlock numbers, look-back contents, the per-day rule, the country or currency source.

## Monetization
No model approved for MVP. Validate repeated usefulness before paywalls. Core privacy, data access, and deletion should not be held hostage to payment.

## Metrics
Track first-record completion, helpfulness feedback, candidate edits/rejections, save/retrieval success, revisit rate, latency, failure rate, cost per analysis, and deletion completion. Do not optimize positive-emotion ratio, streaks, or raw AI acceptance rate.

## Validation
Interview 5–8 potential users about past journaling behavior; test a low-fi core flow; evaluate synthetic emotion examples; ask whether suggestions feel respectful and easy to correct; revise MVP from observed friction.
