# `packages/types`

## Owns

**TypeScript type and interface definitions only** — no runtime logic.

Includes:

- Verification → Reasoning handoff contract `EvidenceAttributes`
- Search → Orchestration handoff contracts `SearchResult` / `SearchOutcome`

## Does not own

- Functions, classes, or side effects
- Validation implementations
- Domain behavior (belongs in `core` or the owning capability package)

## Logical pipeline stage(s)

None (supporting only).

## Status

Contracts used by the stub vertical slice; no runtime logic.
