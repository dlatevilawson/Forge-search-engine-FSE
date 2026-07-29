# `packages/orchestration`

## Owns

**Cross-package coordination** — sequencing, delegation, retries/cancellation (when real), and session run loops.

**CLOSED-1:** This package is the lasting home for Research Orchestrator runtime, Task Planner coordination, Task Queue, and Research Delegation.

## Does not own

- Domain models / pure intent+plan transforms (`core`)
- Retrieval (`search`), verification, reasoning, reporting, memory, workspace
- Types/contracts (`types`)

## vs `core` (Principle 8)

| | `core` | `orchestration` |
|---|---|---|
| Pure domain logic | Yes | No |
| Side effects / calling other packages | No | Yes |
| Sequences stages | No | Yes |

## Logical pipeline stage(s)

- Intent Analysis (runtime ownership; domain models in `core`)
- Research Planning (planner/coordination; plan models in `core`)
- Research Delegation
- End-to-end run loop spanning all stages (not a product stage itself)

## Status

Stub vertical slice present — no real queue, workers, or retries yet.
