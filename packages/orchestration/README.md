# `packages/orchestration`

## Owns (CLOSED-1 — confirmed)

**Coordination with side effects:**

- Intent routing (invoking core intent + planners)
- Execution Plan **dispatch**
- Task scheduling / worker coordination
- Pipeline sequencing
- Failure recovery / retry policy (as executed behavior)

**Research Orchestrator** lives here. It is the only planner/orchestrator component with side effects.

## Does not own

- Research Planner / Execution Planner (pure — `core`)
- Search, verification, reasoning, reporting, persistence logic

## Logical pipeline stage(s)

- Intent Analysis (invocation)
- Research Delegation (dispatch after Execution Planner)
- End-to-end run loop

## Status

Stub vertical slice present — no real queue/workers/retries yet.
