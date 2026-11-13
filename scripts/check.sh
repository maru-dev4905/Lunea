#!/usr/bin/env bash
# Run the same checks as CI (format, lint, typecheck, tests) for apps/mobile.
set -euo pipefail
cd "$(dirname "$0")/../apps/mobile"
npm run -s format:check
npm run -s lint
npm run -s typecheck
npm test --silent
