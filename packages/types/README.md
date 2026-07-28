# `packages/types`

## Scope

**TypeScript type and interface definitions only** — no runtime logic.

Examples of intended ownership:

- Shared domain types (evidence, report sections, session status)
- Cross-package contracts that must remain logic-free
- Public type exports consumed by apps and packages

## Non-Goals

- No functions, classes, or side effects
- No validation implementations (validators may *consume* these types elsewhere)
- No re-exports of vendor SDK types unless deliberately part of a stable contract

## Status

Scaffold only — no application code yet.
