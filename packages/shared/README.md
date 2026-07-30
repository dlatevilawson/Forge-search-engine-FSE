# `packages/shared`

## Owns

Cross-cutting **utilities with no domain knowledge**.

Examples: formatting helpers, logging adapters, config loading, path/env helpers.

## Does not own

- Any research-domain model or pipeline logic
- Session/intent/plan models (`core`)
- Retrieval, verification, reasoning, reporting, memory, or workspace logic

If a helper encodes product meaning (evidence, confidence, workspaces), it does not belong here.

## Logical pipeline stage(s)

None (supporting only).

## Status

Scaffold only — no application code yet.
