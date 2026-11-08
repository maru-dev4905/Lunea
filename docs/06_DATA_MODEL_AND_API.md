# 06 — Data Model and API Draft

## Principles
Every user-owned record has an owner; preserve original text; distinguish AI-generated from user-confirmed data; allow zero/many emotions and user labels; separate AI uncertainty from emotion intensity; enforce server-side ownership.

## Entities (draft)
### JournalEntry
`id`, `user_id`, `body_original`, `body_current` or revision history, `status` (`draft|submitted|saved|deleted`), `entry_date` (user-local date), `timezone`, `created_at`, `updated_at`.

### AnalysisRun
`id`, `entry_id`, `user_id`, `status` (`pending|succeeded|failed|cancelled`), `provider`, `model`, `prompt_version`, `schema_version`, timestamps, safe `error_code`, token counts, estimated cost.

### EventCandidate
`id`, `analysis_run_id`, `description`, `evidence_text` or source span, `sort_order`.

### EmotionCandidate
`id`, `analysis_run_id`, optional `event_candidate_id`, `label`, optional `taxonomy_key`, optional description, `evidence_text`, optional `intensity`, optional `uncertainty`, `origin` (`ai|user`), `review_status` (`proposed|accepted|edited|rejected`), `sort_order`.

### ConfirmedRecord
May be a saved state on JournalEntry or separate aggregate; choose one source of truth. Fields may include `entry_id`, `user_id`, `confirmed_at`, optional `user_summary`. `balance_value` is prohibited until Balance formula is approved.

### EmotionLabel
Optional taxonomy: `key`, `display_name`, `parent_key`, `locale`, `is_active`, `taxonomy_version`. User-authored labels must remain possible.

## State transitions
`draft → submitted → analysis_pending → analysis_ready → user_reviewed → saved`
Alternative branches: analysis failure → retry or save without analysis; user skip → save. AI success alone never confirms.

## Illustrative API
- `POST /v1/journal-entries` create draft.
- `POST /v1/journal-entries/{id}/analysis` start analysis.
- `GET /v1/analysis-runs/{id}` retrieve status/result.
- `POST /v1/journal-entries/{id}/confirm` explicitly save user-reviewed interpretation.
- `GET /v1/journal-entries?from=&to=&cursor=` list own records with pagination.
- `PATCH /v1/journal-entries/{id}` edit own record.
- `DELETE /v1/journal-entries/{id}` delete own record.

Request/response schemas must be versioned and runtime-validated. Treat client ownership fields as untrusted. Do not reveal whether another user's record exists.

## Conceptual AI result
```json
{
  "schemaVersion": "1.0.0",
  "events": [{"description": "프로젝트 발표를 마쳤다.", "evidence": "발표가 끝나서 마음이 놓였어."}],
  "emotionCandidates": [
    {"label": "안도감", "description": "긴장이 풀린 느낌", "evidence": "마음이 놓였어.", "intensity": null, "uncertainty": "medium", "eventIndex": 0},
    {"label": "자부심", "description": "해낸 일에 대한 긍정적 느낌", "evidence": "준비한 만큼 잘 끝낸 것 같아.", "intensity": null, "uncertainty": "medium", "eventIndex": 0}
  ],
  "followUpQuestion": null
}
```
Illustrative only; not a fixed taxonomy or authoritative interpretation.

## Validation and privacy
Bound string lengths/array sizes; reject unknown enum values; validate evidence against source; allow empty arrays; validate owner from auth context; store prompt/schema versions. Define retention, raw provider payload policy (default: do not retain raw sensitive payload logs), deletion propagation, export, and account deletion semantics before production.
