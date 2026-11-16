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
# Every state in a backticked path (words between arrows or bars) must be defined in docs/06.
# Plain words such as `archived` count too; `retry` is an action, not a state.
states=$(grep -o '`[^`]*`' <<<"$sm" | tr -d '`' | awk '{gsub(/→/,"\n"); gsub(/\|/,"\n"); print}' \
  | sed -E 's/^ +//; s/ +$//' | grep -E '^[a-z_]+$' | grep -vx retry | sort -u)
count=$(grep -c . <<<"$states")
if [ "$count" -ge 7 ]; then ok "docs/02 state model yields $count state names (guard against an empty extraction)"; else bad "docs/02 state model yields only $count state names (extraction broke)"; fi
missing=0
transitions=$(section docs/06_DATA_MODEL_AND_API.md "## State transitions")
for t in $states; do
  grep -qw "$t" <<<"$transitions" || { echo "       not defined in docs/06 State transitions: $t"; missing=1; }
done
[ $missing = 0 ] && ok "every state named in docs/02 is defined in docs/06" || bad "every state named in docs/02 is defined in docs/06"

# 3. Plain save without AI is a documented path (D-32).
# The direct path is a path of its own (`draft → saved`), not a prefix of the main path.
if grep -qF '`draft → saved`' <<<"$sm" && grep -Eq 'D-32([^0-9]|$)' <<<"$sm"; then ok "docs/02 has the direct plain-save path (draft to saved, D-32)"; else bad "docs/02 has the direct plain-save path (draft to saved, D-32)"; fi
if grep -qF '`draft → saved`' <<<"$transitions" && grep -Eq 'D-32([^0-9]|$)' <<<"$transitions"; then ok "docs/06 has the direct plain-save path (draft to saved, D-32)"; else bad "docs/06 has the direct plain-save path (draft to saved, D-32)"; fi
check "JRN-02 no longer says 'if approved'" bash -c "! grep -n 'JRN-02' docs/09_MVP_BACKLOG.md | grep -qi 'if approved'"

# 4. Open product questions are registered in docs/10 and referenced where they matter.
for d in D-30 D-31 D-32 D-33; do
  check "$d is registered in docs/10" bash -c "grep -q '^| $d |' docs/10_OPEN_DECISIONS.md"
done
check "docs/06 JournalEntry references D-30 (deletion) and D-31 (original text)" bash -c "grep -E '^\`id\`, \`user_id\`, \`body_original\`' docs/06_DATA_MODEL_AND_API.md | grep -Eq 'D-30([^0-9]|\$)' && grep -E 'body_original' docs/06_DATA_MODEL_AND_API.md | grep -Eq 'D-31([^0-9]|\$)'"
# D-15 is deferred: the clarification question is not part of the MVP, and no document may promise it.
check "D-15 is recorded as Deferred in docs/10"              bash -c "grep '^| D-15 |' docs/10_OPEN_DECISIONS.md | grep -q 'Deferred'"
check "docs/00 charter no longer promises a clarification question" bash -c "! grep -qi 'clarification question' docs/00_PROJECT_CHARTER.md"
flow=$(section docs/03_UX_AND_USER_FLOWS.md "## Primary flow")
deferred_step='6. Clarification question: Deferred (D-15). The MVP asks none; the flow goes from the progress state (step 5) straight to the candidates (step 7).'
qlines=$(grep -ci 'question' <<<"$flow")
# The step must be the exact deferred sentence (any other wording, such as "asks one", fails)
# and no other line of the primary flow may mention a question.
if [ "$qlines" = 1 ] && grep -qFx "$deferred_step" <<<"$flow"; then ok "docs/03 primary flow: the question step is the exact Deferred (D-15) sentence and the only one"; else bad "docs/03 primary flow: the question step is the exact Deferred (D-15) sentence and the only one (question lines: $qlines)"; fi
check "docs/06 marks followUpQuestion as not used in the MVP (D-15)" bash -c "grep 'followUpQuestion' docs/06_DATA_MODEL_AND_API.md | grep -q 'not used in the MVP' && grep 'followUpQuestion' docs/06_DATA_MODEL_AND_API.md | grep -Eq 'D-15([^0-9]|\$)'"
check "docs/06 evidence validation references D-33"          bash -c "grep -E 'evidence' docs/06_DATA_MODEL_AND_API.md | grep -Eq 'D-33([^0-9]|\$)'"
check "docs/06 example keeps followUpQuestion as null"       bash -c "grep -qE '\"followUpQuestion\": null' docs/06_DATA_MODEL_AND_API.md && ! grep -E '\"followUpQuestion\":' docs/06_DATA_MODEL_AND_API.md | grep -qv null"
check "docs/07 asks none in the MVP and returns followUpQuestion as null (D-15)" bash -c "grep -q 'The MVP asks none (D-15 deferred)' docs/07_AI_BEHAVIOR_AND_SAFETY.md && grep -q 'returns \`followUpQuestion\` as null' docs/07_AI_BEHAVIOR_AND_SAFETY.md && grep -q 'no clarification question in the MVP (D-15 deferred)' docs/07_AI_BEHAVIOR_AND_SAFETY.md"

exit $fail
