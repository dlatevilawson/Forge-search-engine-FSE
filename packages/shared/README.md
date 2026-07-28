# `packages/shared`

## Scope

Cross-cutting **utilities with no domain knowledge**.

Examples of intended ownership:

- Formatting helpers
- Logging adapters
- Config loading helpers
- Environment and path utilities

## Non-Goals

- No research-domain models or session logic (see `packages/core`)
- No search/source discovery (see `packages/search`)
- No agent/prompt orchestration (see `packages/ai`)

If a helper encodes product meaning (evidence, confidence, workspaces), it does not belong here.

## Status

Scaffold only — no application code yet.
