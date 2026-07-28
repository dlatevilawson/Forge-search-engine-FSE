# `packages/core`

## Owns

Shared **domain models and core business logic** independent of UI, transport, and retrieval vendors.

Examples:

- Research session state and lifecycle
- Intent / clarified-intent domain models (used by Research Orchestrator)
- Research plan models (used by Task Planner)
- Domain rules shared across packages

## Does not own

- Retrieval adapters (`search`)
- Claim validation (`verification`)
- Consensus/conflict/confidence algorithms (`reasoning`)
- Report formatters (`reporting`)
- Persistence engines (`memory`)
- Project/folder UX (`workspace`)
- Generic utilities with no domain meaning (`shared`)
- Type-only exports (`types`)
- Task queue / worker dispatch infrastructure (**OPEN-1**)

## Logical pipeline stage(s)

- Intent Analysis (domain models; runtime ownership is Research Orchestrator)
- Research Planning (plan domain models; runtime ownership is Task Planner)

## Status

Scaffold only — no application code yet.
