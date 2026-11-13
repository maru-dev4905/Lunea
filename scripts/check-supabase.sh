#!/usr/bin/env bash
# FND-04 PoC checks against the LOCAL Supabase stack (needs Docker). Not part of
# scripts/check.sh because it is slow and requires Docker.
# Usage: scripts/check-supabase.sh [--integration]
set -euo pipefail
cd "$(dirname "$0")/.."
DENO="npx --yes deno@2.9.6"

supabase start >/dev/null
supabase db reset >/dev/null
supabase test db                                   # RLS + hard delete (pgTAP)
(cd supabase/functions && $DENO task check && $DENO task test)   # types + unit tests

if [ "${1:-}" = "--integration" ]; then
  supabase functions serve >/dev/null 2>&1 &
  serve_pid=$!
  trap 'kill $serve_pid 2>/dev/null || true' EXIT
  sleep 20
  eval "$(supabase status -o env | grep -E '^(API_URL|ANON_KEY)=' | sed 's/^API_URL=/export SUPABASE_URL=/; s/^ANON_KEY=/export SUPABASE_ANON_KEY=/')"
  (cd supabase/functions && $DENO test --allow-net=127.0.0.1 --allow-env=SUPABASE_URL,SUPABASE_ANON_KEY analyze-entry/integration.test.ts)
fi
