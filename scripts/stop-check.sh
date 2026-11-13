#!/usr/bin/env bash
# Claude Code Stop hook: block ending a turn while apps/mobile has uncommitted
# changes that fail the project checks. Exit 2 feeds the output back to the agent.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}" || exit 0

input="$(cat)"
# Avoid a loop: if the agent already continued because of this hook, let it stop.
case "$input" in *'"stop_hook_active":true'* | *'"stop_hook_active": true'*) exit 0 ;; esac

# Lesson L-007: commits made on a detached HEAD belong to no branch and never reach the PR.
if ! git symbolic-ref -q HEAD >/dev/null; then
  orphan="$(git rev-list HEAD --not --branches --remotes 2>/dev/null | wc -l | tr -d ' ')"
  if [ "${orphan:-0}" -gt 0 ]; then
    printf 'Detached HEAD with %s commit(s) not on any branch (lesson L-007). Run: git switch <branch> && git merge --ff-only <sha>, then push and confirm the remote SHA.\n' "$orphan" >&2
    exit 2
  fi
fi

[ -d apps/mobile/node_modules ] || exit 0
[ -n "$(git status --porcelain -- apps/mobile scripts)" ] || exit 0

if ! out="$(scripts/check.sh 2>&1)"; then
  printf 'Project checks failed (scripts/check.sh). Fix before finishing:\n%s\n' "$(printf '%s' "$out" | tail -40)" >&2
  exit 2
fi
