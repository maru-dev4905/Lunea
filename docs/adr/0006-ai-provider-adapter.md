# ADR-0006: AI provider adapter and mock-first policy

## Status
Proposed (D-08 provider/model TBD — not decided here)

## Context
AI calls must be server-side, provider-replaceable, schema-validated, and must not process real journal text until provider retention/training/region terms are reviewed (`07`, REL-02).

## Decision (proposed)
- Define a server-side `AnalysisProvider` interface: input = minimized entry context + prompt version; output = raw model response validated by a versioned Zod schema (AI-01).
- Ship **only a deterministic mock provider** until D-08 is decided and provider terms are approved. Selected via `AI_PROVIDER=mock` (already in `.env.example`).
- Invalid output → `analysis_failed`, draft preserved, never coerced into labels (`07`).
- Do not add LangChain or orchestration frameworks; a single adapter function per provider is enough.
- Log only request ID, provider/model, prompt/schema version, latency, token counts, schema outcome, safe error code.

## Consequences
- The full journal → analysis → review → save flow can be built and tested with zero external data processing.
- Choosing a real provider later is one adapter + an evaluation run on the synthetic set (AI-05), plus human approval.

## Owner
Product owner (human).

## Review trigger
D-08 decision.
