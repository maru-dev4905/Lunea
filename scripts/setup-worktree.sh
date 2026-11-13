#!/usr/bin/env bash
# Prepare a fresh worktree: install locked dependencies and copy local env files
# from the primary checkout. Values are copied as files and never printed.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
primary="$(git -C "$root" worktree list --porcelain | awk '/^worktree /{print substr($0,10); exit}')"

(cd "$root/apps/mobile" && npm ci)

if [ "$primary" != "$root" ]; then
  for f in .env.local; do
    src="$primary/apps/mobile/$f"
    dst="$root/apps/mobile/$f"
    if [ -f "$src" ] && [ ! -e "$dst" ]; then
      cp "$src" "$dst" && echo "copied apps/mobile/$f from primary checkout"
    fi
  done
fi
echo "worktree ready"
