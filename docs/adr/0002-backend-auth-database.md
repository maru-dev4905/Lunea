# ADR-0002: Backend, auth, and database

## Status
Proposed — **D-06 is TBD; this ADR is a recommendation, not a decision.**

## Context
Requirements: server-side owner checks/RLS, AI provider calls server-side only, no journal text in logs, separate dev/staging/prod, deletion that can be verified, minimal ops for a very small team. PoC gates in `05`: auth/session refresh, user-scoped CRUD/RLS, server-side AI structured output, secret management, deletion, provider terms.

## Options
| | A. Supabase (Postgres + Auth + RLS + Edge Functions) | B. Standalone Node.js TypeScript API + managed Postgres + auth provider |
|---|---|---|
| Ownership enforcement | Postgres RLS on every table + checks in Edge Functions | Application middleware on every route (easy to forget one) |
| Auth | Built in (email, OAuth, session refresh) | Separate provider or self-built |
| AI calls | Edge Functions hold provider secret | API server holds provider secret |
| Ops | Managed; three projects for dev/staging/prod | Host, DB, auth, secrets, deploy pipeline to run |
| Runtime | Edge Functions run on Deno (different from the Node app toolchain) | Same Node toolchain everywhere |
| Lock-in | Medium (Postgres is portable; Auth/RLS policies are Supabase-specific) | Low |
| Risk | RLS mistakes are silent; must be tested with cross-user tests | More code and infra to secure |

## Decision
Recommended: **A. Supabase**, conditional on a PoC that proves, before any real data:
1. RLS denies cross-user insert/read/update/delete on every journal table, including inserts that set another user's `user_id` (automated tests).
2. Edge Function can call the (mock) AI adapter with the secret never reaching the client.
3. Session refresh works on device.
4. Hard deletion of an entry and its derived rows is verifiable.
5. Project region and data-processing terms are acceptable (D-17, launch region question).

If any gate fails, fall back to B.

Not decided here: auth methods (D-16), retention/deletion promises (D-17), region/legal review.

## Consequences
- `supabase/` directory with migrations and Edge Functions; local development via Supabase CLI (requires Docker on the developer machine).
- Schema changes go through migrations reviewed in PRs.
- Shared Zod schemas must be importable from both Expo (Node tooling) and Edge Functions (Deno) — see ADR-0007.

## Owner
Product owner (human). Must explicitly approve before a Supabase account/project is created.

## Review trigger
PoC gate failure, pricing change, or region/legal review outcome.
