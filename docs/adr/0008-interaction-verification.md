# ADR-0008: Interaction verification (per-PR device preview)

## Status
Proposed (2026-11-16) — becomes Accepted when the product owner accepts it in the LUN-12 PR.

## Context
Interaction (motion, timing, feel) is a core property of Lunéa, and `docs/11` §8 layer 7 requires a real-device check for every UI PR. The owner works alone with AI agents, so the check must cost one QR scan, not a manual build. Compare mode (`/lunea-compare`) needs one preview per variant PR.

## Options
Measured for option A by installing the package in an isolated copy of `apps/mobile` (Expo SDK 58): +7 lockfile packages (1380 to 1387), +4 MB `node_modules` (726 to 730 MB), identical JS bundle sizes (iOS 2388 KB, Android 2376 KB, Web 1136 KB), `expo export` for ios, android and web still succeeds. All seven packages are MIT licensed and have no install scripts (six are Expo packages, one is `arg` 4.1.3).

| | Option | Dependencies | Automatic QR on PR | Notes |
|---|---|---|---|---|
| A | **`expo-updates` added deliberately + EAS Update + Expo Go QR** | +7 packages | Yes | Config is committed and reproducible |
| B | Let `eas update` install `expo-updates` inside CI | 0 in the repo | Yes | `eas update` does this by itself (eas-cli 27.10.0 source); repository and CI then differ and the config is invisible |
| C | No automation; owner runs `npm start` on each PR branch | 0 | No | Does not meet the LUN-12 acceptance criteria |
| D | Development build (`expo-dev-client`) + EAS Update | More than A | Yes | No Expo Go limits, but build and account cost; not needed yet |
| E | Self-hosted Expo Updates protocol server | Many | Possible | Server operations; not proportional |

## Decision
Chosen option: **A** (becomes binding when this ADR is Accepted).
- Each pull request that changes `apps/mobile` publishes to EAS Update on the branch `pr-<PR number>`; the branch name is derived from the PR number only, never from the PR branch name (external input).
- `expo/expo-github-action` 9.0.2 and its `preview` action comment a QR code (`qr-target: expo-go`) on the PR. The owner scans it with Expo Go signed in to the same Expo account.
- EAS project: `@lunea-team/lunea` (the `projectId` and `updates.url` in `app.json` are not secrets). `runtimeVersion` policy is `appVersion`.
- Secrets: `EXPO_TOKEN` exists only as a GitHub Actions secret, never in the repository or in chat. Fork PRs never receive secrets, so the job runs only for same-repository PRs and skips (does not fail) when the token is missing. Dependencies are installed before the token is exposed.
- The workflow is guarded by `scripts/check-workflows.sh` (run in CI): `pull_request` only, least-privilege permissions, third-party actions pinned to commit SHAs, no branch-name interpolation.
- Preview bundles contain `EXPO_PUBLIC_*` values, so previews must only use the dev environment (synthetic data, D-28). staging and prod values never go into a preview.
- Over-the-air updates for production builds are **not** enabled by this ADR. Shipping code outside store review needs its own decision.
- Compare mode: every variant is its own PR, so each gets its own `pr-<N>` branch and its own QR.
- Web is not covered by EAS Update (the first run published android and ios only). Web is checked locally with `npm start` and `w`; a hosted web preview is a follow-up.

## Consequences
- `expo-updates` becomes part of the app and of future native builds.
- Expo Go cannot load custom native modules; the first need for one is the trigger to move to option D.
- **Checked on a real device (2026-11-16):** CodeRabbit pointed out that Expo's docs say updates published with `runtimeVersion` cannot be loaded in Expo Go. The first real run (`runtimeVersion` policy `appVersion`, runtime 0.1.0, platforms android and ios) posted the QR comment and the owner opened the app in Expo Go on a phone, so the preview works with the current configuration. If a later Expo Go or SDK change breaks this, the Review trigger below applies and the fallback is option D (`expo-dev-client`).
- Previews depend on the Expo service. If it is down, fall back to option C.
- The token needs rotation if it leaks; Actions secrets are the only place it lives.
- Trust model: `eas update` bundles the PR branch (`app.json`, Metro and Babel config, plugins), so code from a same-repository PR runs while the token is available. Fork PRs are excluded and the token belongs to a minimum-role robot user, so only people with write access (or a hijacked account) can reach it. If collaborators are added, put the job behind an Actions `environment` with required approval. `eas-cli` is pinned to an exact version in the workflow because it runs with the token.
- Published preview bundles are effectively public: the project id is in this public repository and branch names (`pr-<N>`) are predictable. Today they contain no `EXPO_PUBLIC_*` values; unreleased designs and copy shown in a preview can be seen by anyone with the URL, and the policy check rejects `EXPO_PUBLIC_*` and Supabase values in the workflow.
- Without `EXPO_TOKEN` the job skips with a notice. The token belongs to a robot user of the `lunea-team` organization with the lowest role that can publish updates.

## Owner
Product owner (human).

## Review trigger
A native module Expo Go cannot load, Expo service pricing or availability problems, or a decision to ship OTA updates to production. Before the first EAS Build, decide `updates.checkAutomatically` (for example `NEVER`) together with the channel mapping: `expo-updates` plus `updates.url` otherwise lets store builds check for updates at launch, and "no production OTA" is not enforced by code today.
