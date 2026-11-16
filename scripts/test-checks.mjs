#!/usr/bin/env node
// Regression tests for the check scripts themselves (lesson L-008, defense level L3).
//
// A check that passes on a defective input is worse than no check, because people trust it.
// Every case below injects one defect into a COPY of a real file and requires the check
// script to FAIL on the check that is meant to catch it. Cases marked `pass` must still
// pass (they guard against over-strict checks). The files in the repository are never edited.
//
// To add a case: put the exact text to change in `find` (the run fails if it is not found,
// so a stale case cannot silently pass), the replacement in `replace`, and part of the
// expected failing check name in `expect`.
//
// Overrides (used to prove this harness catches weak checks, see L-008):
//   WORKFLOWS_CHECK=<path>  SPEC_CHECK=<path>
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workflowsCheck = resolve(process.env.WORKFLOWS_CHECK ?? join(root, 'scripts/check-workflows.sh'));
const specCheck = resolve(process.env.SPEC_CHECK ?? join(root, 'scripts/check-spec-consistency.sh'));
const previewYml = '.github/workflows/preview.yml';
const eas = 'eas-version: 27.10.0';
const sha = '5273c2136bd09c2a341fe3340d3e767ce5a13015 # 9.0.2';

/** @type {{kind:'workflows'|'spec', name:string, file:string, find:string, replace:string, expect?:string, pass?:boolean}[]} */
const cases = [
  // ---- .github/workflows/preview.yml (scripts/check-workflows.sh) ----
  { kind: 'workflows', name: 'pull_request_target', file: previewYml, find: '\n  pull_request:\n', replace: '\n  pull_request_target:\n', expect: 'never uses pull_request_target' },
  { kind: 'workflows', name: 'trigger changed to push', file: previewYml, find: '\n  pull_request:\n', replace: '\n  push:\n', expect: 'triggers on pull_request' },
  { kind: 'workflows', name: 'trigger changed to workflow_dispatch', file: previewYml, find: '\n  pull_request:\n', replace: '\n  workflow_dispatch:\n', expect: 'triggers on pull_request' },
  { kind: 'workflows', name: 'on: key removed', file: previewYml, find: '\non:\n', replace: '\ntrigger:\n', expect: 'triggers on pull_request' },
  { kind: 'workflows', name: 'action not pinned to a SHA', file: previewYml, find: sha, replace: 'v9 # 9.0.2', expect: 'pinned to a full commit SHA' },
  { kind: 'workflows', name: 'branch name from head_ref', file: previewYml, find: 'pr-${{ github.event.pull_request.number }}', replace: '${{ github.head_ref }}', expect: 'never interpolates head ref' },
  { kind: 'workflows', name: 'extra write permission', file: previewYml, find: '  pull-requests: write', replace: '  pull-requests: write\n  issues: write', expect: 'no write-all or other write' },
  { kind: 'workflows', name: 'permission only in a comment', file: previewYml, find: '  contents: read', replace: '  # contents: read', expect: 'permissions: contents read' },
  { kind: 'workflows', name: 'different secret referenced', file: previewYml, find: 'token: ${{ secrets.EXPO_TOKEN }}', replace: 'token: ${{ secrets.OTHER }}', expect: 'secrets are only referenced' },
  { kind: 'workflows', name: 'fork guard removed', file: previewYml, find: 'if: github.event.pull_request.head.repo.full_name == github.repository', replace: 'if: true', expect: 'only same-repo PRs' },
  { kind: 'workflows', name: 'missing token no longer skips', file: previewYml, find: 'EXPO_TOKEN not set', replace: 'something else', expect: 'missing EXPO_TOKEN skips' },
  { kind: 'workflows', name: 'job timeout removed', file: previewYml, find: 'timeout-minutes: 15', replace: '', expect: 'job has a timeout' },
  { kind: 'workflows', name: 'superseded runs not cancelled', file: previewYml, find: 'cancel-in-progress: true', replace: 'cancel-in-progress: false', expect: 'superseded runs are cancelled' },
  { kind: 'workflows', name: 'QR target changed', file: previewYml, find: 'qr-target: expo-go', replace: 'qr-target: dev-build', expect: 'QR opens in Expo Go' },
  { kind: 'workflows', name: 'eas-cli latest', file: previewYml, find: eas, replace: 'eas-version: latest', expect: 'pinned to one exact version' },
  { kind: 'workflows', name: 'eas-cli caret range', file: previewYml, find: eas, replace: 'eas-version: ^27.10.0', expect: 'pinned to one exact version' },
  { kind: 'workflows', name: 'eas-cli wildcard', file: previewYml, find: eas, replace: 'eas-version: 27.x', expect: 'pinned to one exact version' },
  { kind: 'workflows', name: 'eas-cli range with ||', file: previewYml, find: eas, replace: 'eas-version: 27.10.0 || >=27.10.1', expect: 'pinned to one exact version' },
  { kind: 'workflows', name: 'eas-cli quoted range with ||', file: previewYml, find: eas, replace: 'eas-version: "27.10.0 || >=27.10.1"', expect: 'pinned to one exact version' },
  { kind: 'workflows', name: 'PR title interpolated', file: previewYml, find: 'command: eas update --auto', replace: 'command: echo ${{ github.event.pull_request.title }}; eas update --auto', expect: 'no untrusted event text' },
  { kind: 'workflows', name: 'EXPO_PUBLIC value added', file: previewYml, find: '          qr-target: expo-go', replace: '          qr-target: expo-go\n        env:\n          EXPO_PUBLIC_SUPABASE_URL: https://example.invalid', expect: 'carry no EXPO_PUBLIC' },
  { kind: 'workflows', name: 'quoted exact eas-cli version is still accepted', file: previewYml, find: eas, replace: 'eas-version: "27.10.0"', pass: true },
  { kind: 'workflows', name: 'exact eas-cli version with a trailing comment is still accepted', file: previewYml, find: eas, replace: 'eas-version: 27.10.0 # pinned', pass: true },

  // ---- docs (scripts/check-spec-consistency.sh) ----
  { kind: 'spec', name: 'user_review reintroduced', file: 'docs/02_MVP_PRD.md', find: '→ saved` (the user reviews', replace: '→ user_review` (the user reviews', expect: 'no user_review' },
  { kind: 'spec', name: 'skipped used as a state', file: 'docs/02_MVP_PRD.md', find: 'Alternatives:', replace: 'Alternatives: `analysis_ready → skipped → saved`;', expect: 'does not use skipped/discarded' },
  { kind: 'spec', name: 'plain-save path removed from docs/02', file: 'docs/02_MVP_PRD.md', find: '; plain save without AI: `draft → saved` (D-32, accepted)', replace: '; plain save without AI (D-32, accepted)', expect: 'docs/02 has the direct plain-save path' },
  { kind: 'spec', name: 'plain-save path removed from docs/06', file: 'docs/06_DATA_MODEL_AND_API.md', find: '- Plain save without AI (D-32, accepted): `draft → saved`.', replace: '- Plain save without AI (D-32, accepted).', expect: 'docs/06 has the direct plain-save path' },
  { kind: 'spec', name: 'docs/02 names a state docs/06 lacks', file: 'docs/02_MVP_PRD.md', find: 'Alternatives:', replace: 'Alternatives: `awaiting_user` ;', expect: 'every state named in docs/02 is defined' },
  { kind: 'spec', name: 'state without underscore (archived)', file: 'docs/02_MVP_PRD.md', find: 'Alternatives:', replace: 'Alternatives: `analysis_ready → archived`;', expect: 'every state named in docs/02 is defined' },
  { kind: 'spec', name: 'state appended to a path (hidden)', file: 'docs/02_MVP_PRD.md', find: '`draft → submitted → saved`', replace: '`draft → submitted → saved → hidden`', expect: 'every state named in docs/02 is defined' },
  { kind: 'spec', name: 'JRN-02 "if approved" is back', file: 'docs/09_MVP_BACKLOG.md', find: 'is allowed (D-32)', replace: 'if approved', expect: 'JRN-02 no longer' },
  { kind: 'spec', name: 'D-33 removed from docs/10', file: 'docs/10_OPEN_DECISIONS.md', find: '| D-33 |', replace: '| D-99 |', expect: 'D-33 is registered' },
  { kind: 'spec', name: 'D-33 reference dropped from docs/06', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'D-33, provisional;', replace: 'provisional;', expect: 'docs/06 evidence validation references D-33' },
  { kind: 'spec', name: 'charter promises the clarification question again', file: 'docs/00_PROJECT_CHARTER.md', find: 'write a journal entry, ', replace: 'write a journal entry, optionally answer one clarification question, ', expect: 'charter no longer promises' },
  { kind: 'spec', name: 'D-15 no longer Deferred', file: 'docs/10_OPEN_DECISIONS.md', find: 'Deferred (2026-11-16, owner)', replace: 'Proposed optional (2026-11-16, owner)', expect: 'D-15 is recorded as Deferred' },
  { kind: 'spec', name: 'docs/03 step 6 restored', file: 'docs/03_UX_AND_USER_FLOWS.md', find: 'Clarification question: Deferred (D-15).', replace: 'Optionally ask one clarification question.', expect: 'docs/03 primary flow' },
  { kind: 'spec', name: 'docs/03 extra question step', file: 'docs/03_UX_AND_USER_FLOWS.md', find: '7. Show event/emotion candidates with evidence.', replace: '6b. Ask the user one follow-up question.\n7. Show event/emotion candidates with evidence.', expect: 'docs/03 primary flow' },
  { kind: 'spec', name: 'docs/03 step says "asks one"', file: 'docs/03_UX_AND_USER_FLOWS.md', find: 'The MVP asks none;', replace: 'The MVP asks one;', expect: 'docs/03 primary flow' },
  { kind: 'spec', name: 'docs/03 step loses the D-15 reference', file: 'docs/03_UX_AND_USER_FLOWS.md', find: 'Deferred (D-15).', replace: 'Deferred.', expect: 'docs/03 primary flow' },
  { kind: 'spec', name: 'followUpQuestion example is a string', file: 'docs/06_DATA_MODEL_AND_API.md', find: '"followUpQuestion": null', replace: '"followUpQuestion": "그때 기분이 어땠어?"', expect: 'docs/06 example keeps followUpQuestion as null' },
  { kind: 'spec', name: 'docs/06 loses the "not used in the MVP" note', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'not used in the MVP (D-15 deferred)', replace: 'ignored', expect: 'docs/06 marks followUpQuestion' },
  { kind: 'spec', name: 'docs/07 loses the null-return rule', file: 'docs/07_AI_BEHAVIOR_AND_SAFETY.md', find: 'and returns `followUpQuestion` as null.', replace: 'and may return `followUpQuestion`.', expect: 'docs/07 asks none' },
  { kind: 'spec', name: 'docs/07 loses the prompt-contract note', file: 'docs/07_AI_BEHAVIOR_AND_SAFETY.md', find: 'no clarification question in the MVP (D-15 deferred);', replace: 'ask one question only if useful;', expect: 'docs/07 asks none' },
  // Decision ids must match as whole ids: D-330 is not D-33 (found by review of PR #14).
  { kind: 'spec', name: 'D-33 reference replaced by D-330 in docs/06', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'D-33, provisional;', replace: 'D-330, provisional;', expect: 'docs/06 evidence validation references D-33' },
  { kind: 'spec', name: 'D-32 reference replaced by D-320 in docs/02', file: 'docs/02_MVP_PRD.md', find: '`draft → saved` (D-32, accepted)', replace: '`draft → saved` (D-320, accepted)', expect: 'docs/02 has the direct plain-save path' },
  { kind: 'spec', name: 'D-32 reference replaced by D-320 in docs/06', file: 'docs/06_DATA_MODEL_AND_API.md', find: '(D-32, accepted): `draft → saved`.', replace: '(D-320, accepted): `draft → saved`.', expect: 'docs/06 has the direct plain-save path' },
  { kind: 'spec', name: 'D-30 reference replaced by D-300 in the docs/06 JournalEntry', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'there is no `deleted` status, D-30)', replace: 'there is no `deleted` status, D-300)', expect: 'docs/06 JournalEntry references D-30' },
  { kind: 'spec', name: 'D-15 reference replaced by D-150 on the followUpQuestion note', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'not used in the MVP (D-15 deferred)', replace: 'not used in the MVP (D-150 deferred)', expect: 'docs/06 marks followUpQuestion' },
  // A correct id elsewhere must not hide a wrong id where it matters (found by review of PR #14).
  { kind: 'spec', name: 'wrong D-32 on the docs/02 direct path while D-32 appears elsewhere', file: 'docs/02_MVP_PRD.md', find: '`draft → saved` (D-32, accepted)', replace: '`draft → saved` (D-320, accepted)', also: [{ file: 'docs/02_MVP_PRD.md', find: 'removing a draft is deletion (D-30), not a state.', replace: 'removing a draft is deletion (D-30), not a state; see D-32.' }], expect: 'docs/02 has the direct plain-save path' },
  { kind: 'spec', name: 'wrong D-32 on the docs/06 direct path while D-32 appears elsewhere', file: 'docs/06_DATA_MODEL_AND_API.md', find: '(D-32, accepted): `draft → saved`.', replace: '(D-320, accepted): `draft → saved`.', also: [{ file: 'docs/06_DATA_MODEL_AND_API.md', find: '- AI success alone never confirms.', replace: '- AI success alone never confirms (see D-32).' }], expect: 'docs/06 has the direct plain-save path' },
  { kind: 'spec', name: 'wrong D-31 in the docs/06 JournalEntry while D-31 appears on another body_original line', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'edits are kept as revisions, D-31)', replace: 'edits are kept as revisions, D-310)', expect: 'docs/06 JournalEntry references D-30' },
  { kind: 'spec', name: 'wrong D-15 on the followUpQuestion note while the JSON example mentions D-15', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'not used in the MVP (D-15 deferred)', replace: 'not used in the MVP (D-150 deferred)', also: [{ file: 'docs/06_DATA_MODEL_AND_API.md', find: '"followUpQuestion": null', replace: '"followUpQuestion": null, "_": "D-15"' }], expect: 'docs/06 marks followUpQuestion' },
  { kind: 'spec', name: 'wrong D-33 on the docs/06 validation line while another evidence line mentions D-33', file: 'docs/06_DATA_MODEL_AND_API.md', find: 'D-33, provisional;', replace: 'D-330, provisional;', also: [{ file: 'docs/06_DATA_MODEL_AND_API.md', find: '`evidence_text` or source span, `sort_order`.', replace: '`evidence_text` or source span (D-33), `sort_order`.' }], expect: 'docs/06 evidence validation references D-33' },
];

const sh = (script, cwd, env = {}) =>
  spawnSync('bash', [script], { cwd, env: { ...process.env, ...env }, encoding: 'utf8' });
const failedChecks = (out) => out.split('\n').filter((l) => l.startsWith('FAIL')).join('\n');

let problems = 0;
const report = (ok, label, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} - ${label}${detail ? `\n       ${detail}` : ''}`);
  if (!ok) problems += 1;
};

const work = mkdtempSync(join(tmpdir(), 'lunea-check-tests-'));
try {
  // Sandbox for the docs checks: the script resolves the repo root from its own location.
  const specRoot = join(work, 'spec');
  mkdirSync(join(specRoot, 'scripts'), { recursive: true });
  cpSync(join(root, 'docs'), join(specRoot, 'docs'), { recursive: true });
  const specScript = join(specRoot, 'scripts/check-spec-consistency.sh');
  cpSync(specCheck, specScript);

  // Unmodified inputs must pass; otherwise every "must fail" below would prove nothing.
  const baseWf = sh(workflowsCheck, root, { WORKFLOW_FILE: join(root, previewYml) });
  report(baseWf.status === 0, 'baseline: the real workflow passes check-workflows.sh', failedChecks(baseWf.stdout));
  const baseSpec = sh(specScript, specRoot);
  report(baseSpec.status === 0, 'baseline: the real docs pass check-spec-consistency.sh', failedChecks(baseSpec.stdout));

  cases.forEach((c, i) => {
    // `also` lets a case plant a correct reference elsewhere (for example on another line of
    // the same section) so a check that searches too widely cannot pass by accident.
    const edits = [{ file: c.file, find: c.find, replace: c.replace }, ...(c.also ?? [])];
    const originals = new Map(); // file -> untouched content
    const mutated = new Map(); // file -> content with the edits applied one after another
    let stale = null;
    for (const e of edits) {
      if (!originals.has(e.file)) {
        const text = readFileSync(join(root, e.file), 'utf8');
        originals.set(e.file, text);
        mutated.set(e.file, text);
      }
      if (!mutated.get(e.file).includes(e.find)) {
        stale = e;
        break;
      }
      mutated.set(e.file, mutated.get(e.file).replace(e.find, e.replace));
    }
    if (stale) {
      report(false, `${c.name}: stale case, text not found in ${stale.file}`, JSON.stringify(stale.find));
      return;
    }
    let result;
    if (c.kind === 'workflows') {
      const file = join(work, `case-${i}.yml`);
      writeFileSync(file, mutated.get(c.file));
      result = sh(workflowsCheck, root, { WORKFLOW_FILE: file });
    } else {
      for (const [file, text] of mutated) writeFileSync(join(specRoot, file), text);
      result = sh(specScript, specRoot);
      for (const [file, text] of originals) writeFileSync(join(specRoot, file), text); // restore the sandbox copies
    }
    if (c.pass) {
      report(result.status === 0, `${c.name} (must pass)`, failedChecks(result.stdout));
    } else {
      const caught = result.status !== 0 && result.stdout.includes(`FAIL - `) && failedChecks(result.stdout).includes(c.expect);
      report(caught, `${c.name} (must fail on "${c.expect}")`, caught ? '' : `MISSED. Failing checks: ${failedChecks(result.stdout) || 'none'}`);
    }
  });
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log(`\n${cases.length + 2} cases, ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
