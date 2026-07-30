# `packages/core`

## Owns

Shared **domain models and pure business logic** — no I/O, no cross-package coordination.

- Intent Analysis transform (`analyzeIntent`)
- **Research Planner** (`planResearch`) → Research Plan
- **Execution Planner** (`planExecution`) → Execution Plan
- Session/domain models independent of UI and vendors

## Does not own

- Dispatch, retries, worker calls (`orchestration`)
- Retrieval, verification, reasoning, reporting, memory, workspace
- Generic utilities (`shared`) or type-only exports (`types`)

## Logical pipeline stage(s)

- Intent Analysis (logic)
- Research Planning (Research Planner)
- Research Delegation — **Execution Plan only** (dispatch is `orchestration`)

## Status

Pure stub planners used by the vertical slice.
