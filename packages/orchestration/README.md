# `packages/orchestration`

## Owns

**Cross-package coordination** — sequencing, delegation, retries/cancellation (when real), and session run loops.

Created because the vertical slice needed a place for Research Delegation and the end-to-end stage sequencer. That is **not** a silent resolution of OPEN-1; founders still decide the lasting home.

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

- Research Delegation (coordination)
- End-to-end run loop spanning all stages (not a product stage itself)

## Status

Stub vertical slice only — no real queue, workers, or retries yet.
