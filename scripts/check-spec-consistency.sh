#!/usr/bin/env bash
# Spec consistency checks (LUN-13 / DOC-01). The state model must be named the same way
# in docs/02, docs/03 and docs/06, and open product questions must be registered in docs/10.
set -uo pipefail
cd "$(dirname "$0")/.."
fail=0
ok()   { echo "ok   - $1"; }
bad()  { echo "FAIL - $1"; fail=1; }
check() { local d=$1; shift; if "$@" >/dev/null 2>&1; then ok "$d"; else bad "$d"; fi; }

section() { # file heading -> body of that section (up to the next "## ")
  awk -v h="$2" '$0==h{p=1;next} /^## /{p=0} p' "$1"
}

specs=(docs/0[0-9]_*.md docs/10_OPEN_DECISIONS.md)

# 1. The same stage must not exist under two names.
check "no user_review / user_reviewed as a state name (review is a UI step, not a stored state)" \
  bash -c "! grep -rnwE 'user_review|user_reviewed' ${specs[*]}"

# 2. docs/02 state model: no phantom states, every named state is defined in docs/06.
sm=$(section docs/02_MVP_PRD.md "## State model")
# (Direct tests: the section text contains backticks, so it must not go through `bash -c`.)
if grep -qwE 'skipped|discarded' <<<"$sm"; then bad "docs/02 state model does not use skipped/discarded as states"; else ok "docs/02 state model does not use skipped/discarded as states"; fi
missing=0
for t in $(grep -oE '[a-z]+(_[a-z]+)+|\b(draft|submitted|saved)\b' <<<"$sm" | sort -u); do
  section docs/06_DATA_MODEL_AND_API.md "## State transitions" | grep -qw "$t" || { echo "       not defined in docs/06 State transitions: $t"; missing=1; }
done
[ $missing = 0 ] && ok "every state named in docs/02 is defined in docs/06" || bad "every state named in docs/02 is defined in docs/06"

# 3. Plain save without AI is a documented path (D-32).
if grep -qE 'draft.*saved' <<<"$sm" && grep -q 'D-32' <<<"$sm"; then ok "docs/02 state model has the plain-save path (draft to saved, D-32)"; else bad "docs/02 state model has the plain-save path (draft to saved, D-32)"; fi
check "JRN-02 no longer says 'if approved'" bash -c "! grep -n 'JRN-02' docs/09_MVP_BACKLOG.md | grep -qi 'if approved'"

# 4. Open product questions are registered in docs/10 and referenced where they matter.
for d in D-30 D-31 D-32 D-33; do
  check "$d is registered in docs/10" bash -c "grep -q '^| $d |' docs/10_OPEN_DECISIONS.md"
done
check "docs/06 JournalEntry references D-30 (deletion) and D-31 (original text)" bash -c "grep -E '^\`id\`, \`user_id\`, \`body_original\`' docs/06_DATA_MODEL_AND_API.md | grep -q 'D-30' && grep -E 'body_original' docs/06_DATA_MODEL_AND_API.md | grep -q 'D-31'"
check "docs/06 marks followUpQuestion as pending D-15"       bash -c "grep -q 'D-15' docs/06_DATA_MODEL_AND_API.md"
check "docs/06 evidence validation references D-33"          bash -c "grep -E 'evidence' docs/06_DATA_MODEL_AND_API.md | grep -q 'D-33'"
check "docs/03 clarification step references D-15"           bash -c "grep -E 'clarification question' docs/03_UX_AND_USER_FLOWS.md | head -1 | grep -q 'D-15'"
check "D-15 next step lists the concrete options in docs/10" bash -c "grep '^| D-15 |' docs/10_OPEN_DECISIONS.md | grep -qi 'state'"

exit $fail
