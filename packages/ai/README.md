# `packages/ai`

## Scope

**Model and agent orchestration** and prompting logic.

Examples of intended ownership:

- Agent run orchestration helpers
- Prompt construction and model invocation adapters
- Coordination primitives used by the Research Orchestrator and specialized agents

## Non-Goals

- No durable domain state ownership (see `packages/core`)
- No report document assembly/formatting (see `packages/reporting`)
- No raw web crawling/source discovery (see `packages/search`)

## Open Question

Verification, consensus, and conflict-detection logic may live here **or** in a future `packages/verification`. This boundary is flagged, not decided. See `docs/03-System-Architecture.md` and `packages/README.md`.

## Status

Scaffold only — no application code yet.
