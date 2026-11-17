# 04 — Visual Design Specification

## Brand
Lunéa (`lunea`, 루네아): quiet, minimal, reflective, intimate. Moonlight may be a subtle association, not a requirement for literal moon illustrations.

## Principles
- Sparse composition and generous negative space.
- Thin lines and restrained typography.
- Barely visible gradients, if any.
- Very subtle micro-interactions.
- Motion supports orientation, never competes with reading.
- No visual gamification or decorative complexity.

## Visual direction (D-34)
Accepted by the owner on 2026-11-16: a bright warm white background (`#FAF9F6`), black ink (`#151515`) as the only accent, hairline strokes and small dots, one emphasis at a time, and calm motion that keeps the screens from feeling empty. Inspiration only: a public tab-bar motion sample (a short ink bar that slides between tabs, its leading edge springing ahead of the trailing edge). Nothing from the paid pack was used, and nothing is copied. Dark mode (D-20), fonts and the high-fi core flow are still open.

## Color tokens
The final palette is still TBD pending the high-fi design; the values in `apps/mobile/src/theme/tokens.ts` follow D-34. Text colors must keep 4.5:1 contrast on the backgrounds they are used on (checked by `tests/design-tokens.test.ts`). Use semantic tokens: `background`, `surface`, `surfaceElevated`, `textPrimary`, `textSecondary`, `textMuted`, `borderSubtle`, `accent`, `accentSoft`, `success`, `warning`, `danger`. Use neutral surfaces and one restrained accent. Never encode emotion meaning only by color.

## Typography/layout
Prioritize Korean long-form readability, comfortable line height, legible weights, safe-area-aware layout, consistent spacing, and accessible touch targets. Font and exact scale TBD pending platform/licensing review.

## Motion
Tokens (`tokens.motion`): durations 150/250/400 ms; the tab indicator uses a fast leading spring and a slower trailing spring. Every animation reads `useReducedMotion()` and falls back to an instant change.

Optional opacity/position transitions and subtle focus/save feedback. Respect OS reduced-motion; avoid continuous battery-draining animation; no motion that implies the user's emotion; all interactions must work with animation disabled.

## No background fills (D-36)
The UI has no background colors. Shapes are told apart by lines, shadows and motion only. The one fill is the screen canvas (`color.background`). Buttons and notices are outlined; the receipt paper is a hairline with a soft outset shadow. Thin bars that are lines in practice (hairlines, dashes, the tab indicator, barcode bars) may be drawn filled. `tests/no-fills.test.ts` enforces this.

## Receipt (provisional, D-12, D-35, D-37)
A receipt-like look is the shareable view of a saved record, laid out like a real one: brand, title, the event, receipt number and date; a dashed line; one row per feeling with its price on the right and a quote of the user's own words under it (D-33); a dashed line; the total; today's deposit and the running balance; the streak; a barcode; a thank-you and a note that the numbers are made up. It lives in `src/receipt` and `app/receipt`, so it can be changed or removed.

Prices, balance and streak are synthetic. How a feeling gets a price is undecided (D-11), so nothing computes one; the receipt only adds up what it is given. Feelings sit side by side and are never ranked, and no copy shames a missed day.

Still not approved: thermal-paper textures, perforated edges, generated daily keepsake objects. Keep record detail modular.

### Water-like motion
Motion is as soft as a ripple spreading on still water: unhurried durations (`tokens.motion`), a long soft landing (`calm` easing), no bounce (the tab indicator springs are damped so they do not overshoot), one-shot and never looping. On the receipt, lines and the barcode draw themselves from left to right and top to bottom, and the words fade in under them. Everything is hidden from screen readers when decorative, and replaced by an instant, static view when the system asks for reduced motion.

## Initial component inventory
`AppScreen`, `AppHeader`, `PrimaryButton`, `SecondaryButton`, `TextField`, `JournalComposer`, `MessageBubble` (if conversation retained), `EmotionChip`, `EmotionCandidate`, `EvidenceText`, `RecordPreview`, `RecordDate`, `EmptyState`, `LoadingState`, `ErrorState`, `ConfirmDialog`, `BottomNavigation`.

## Required design deliverables
Low-fi wireframes for Today, Journal, Emotion Review, Save, Collection, Detail, Settings; one high-fi core flow; color/type/spacing/radius/motion tokens; component states; light/dark decision; accessibility review.

## Acceptance
Users focus on their words, understand AI provenance, correct suggestions without friction, and navigate without relying on color or animation.
