#!/usr/bin/env bash
# Static policy checks for the workflow that handles secrets (FND-05, ADR-0008).
# It guards the properties that must not regress: no secret exposure to fork PRs,
# no injection through branch names, least privilege, pinned third-party actions.
# WORKFLOW_FILE overrides the file under test (used to prove the checks fail on bad input).
set -uo pipefail
cd "$(dirname "$0")/.."
f=${WORKFLOW_FILE:-.github/workflows/preview.yml}
fail=0
check() { # description, command...
  local d=$1; shift
  if "$@" >/dev/null 2>&1; then echo "ok   - $d"; else echo "FAIL - $d"; fail=1; fi
}
has()  { grep -Eq "$1" "$f"; }
hasnt() { ! grep -Eq "$1" "$f"; }

[ -f "$f" ] || { echo "FAIL - $f does not exist"; exit 1; }
# Full-line comments must not satisfy a check: test a copy without them.
src=$f
f=$(mktemp)
trap 'rm -f "$f"' EXIT
sed -E '/^[[:space:]]*#/d' "$src" > "$f"

check "triggers on pull_request"                              bash -c "grep -Eq '^on:' '$f' && grep -Eq '^  pull_request:' '$f'"
check "never uses pull_request_target (would expose secrets to forks)" hasnt 'pull_request_target'
check "permissions: contents read"                            has 'contents: read'
check "permissions: pull-requests write (for the QR comment)" has 'pull-requests: write'
check "no write-all or other write permissions"               bash -c "! grep -E '^\s+[a-z-]+: write' '$f' | grep -v 'pull-requests: write' | grep -q . && ! grep -q 'write-all' '$f'"
check "only same-repo PRs (secrets are never available to forks)" has 'head\.repo\.full_name == github\.repository'
check "never interpolates head ref / branch name (injection)" hasnt 'head\.ref|head_ref|github\.ref_name'
check "update branch is derived from the PR number"           has 'pr-\$\{\{ github\.event\.pull_request\.number \}\}'
check "secrets are only referenced as secrets.EXPO_TOKEN"     bash -c "! grep -o 'secrets\.[A-Za-z_]*' '$f' | grep -v '^secrets\.EXPO_TOKEN$' | grep -q ."
check "missing EXPO_TOKEN skips instead of failing"           has 'EXPO_TOKEN not set'
check "dependencies are installed before the token is exposed" bash -c "awk '/npm ci/{a=NR} /token: \\\$\\{\\{ secrets.EXPO_TOKEN/{b=NR} END{exit !(a && b && a<b)}' '$f'"
check "every third-party action is pinned to a full commit SHA" bash -c "! grep -E '^\s*-?\s*uses:' '$f' | grep -vE '@[0-9a-f]{40}( |$)' | grep -q ."
check "job has a timeout"                                     has 'timeout-minutes:'
check "superseded runs are cancelled"                         has 'cancel-in-progress: true'
check "never prints secrets or enables shell tracing"         hasnt 'set -x|echo .*secrets'
check "eas-cli (holds the token) is pinned to an exact version"  bash -c "grep -Eq 'eas-version: *[0-9]+\\.[0-9]+\\.[0-9]+' '$f' && ! grep -Eq 'eas-version: *(latest|[~^])' '$f'"
check "no untrusted event text is interpolated (title, body, label, comments)" hasnt 'github\.event\.(pull_request\.(title|body)|pull_request\.head\.label|comment|issue|review|head_commit)|head\.label'
check "previews carry no EXPO_PUBLIC values or extra env (dev-only rule, D-28)" hasnt 'EXPO_PUBLIC_|SUPABASE'
check "QR opens in Expo Go"                                   has 'qr-target: expo-go'

exit $fail
