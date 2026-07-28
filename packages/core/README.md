# `packages/core`

## Scope

Shared **business logic and domain models** for the research platform.

Examples of intended ownership:

- Research session state and lifecycle
- Project workspace logic
- Domain rules that are independent of UI, model providers, and transport

## Non-Goals

- No UI components
- No model-provider SDKs or prompt templates (see `packages/ai`)
- No generic utilities without domain meaning (see `packages/shared`)
- No type-only exports that belong in `packages/types`

## Status

Scaffold only — no application code yet.
