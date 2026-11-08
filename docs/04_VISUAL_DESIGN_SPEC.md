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

## Color tokens
Exact palette TBD. Use semantic tokens: `background`, `surface`, `surfaceElevated`, `textPrimary`, `textSecondary`, `textMuted`, `borderSubtle`, `accent`, `accentSoft`, `success`, `warning`, `danger`. Use neutral surfaces and one restrained accent. Never encode emotion meaning only by color.

## Typography/layout
Prioritize Korean long-form readability, comfortable line height, legible weights, safe-area-aware layout, consistent spacing, and accessible touch targets. Font and exact scale TBD pending platform/licensing review.

## Motion
Optional opacity/position transitions and subtle focus/save feedback. Respect OS reduced-motion; avoid continuous battery-draining animation; no motion that implies the user's emotion; all interactions must work with animation disabled.

## Unresolved metaphor
Receipt-like record and Collection have been explored but are not final. Do not implement thermal-paper textures, perforated edges, currency/transaction language, collectible rewards, or generated daily keepsake objects without approval. Keep record detail modular.

## Initial component inventory
`AppScreen`, `AppHeader`, `PrimaryButton`, `SecondaryButton`, `TextField`, `JournalComposer`, `MessageBubble` (if conversation retained), `EmotionChip`, `EmotionCandidate`, `EvidenceText`, `RecordPreview`, `RecordDate`, `EmptyState`, `LoadingState`, `ErrorState`, `ConfirmDialog`, `BottomNavigation`.

## Required design deliverables
Low-fi wireframes for Today, Journal, Emotion Review, Save, Collection, Detail, Settings; one high-fi core flow; color/type/spacing/radius/motion tokens; component states; light/dark decision; accessibility review.

## Acceptance
Users focus on their words, understand AI provenance, correct suggestions without friction, and navigate without relying on color or animation.
