# Runtime Architecture

**Document:** `04a-Runtime-Architecture.md`  
**Version:** `v0.1`  
**Architecture Type:** Runtime Architecture  
**Authority:** Subordinate to Master Vision → Founder Brief → Constitution

> **Separation rule.** This document describes *how* the research pipeline executes — orchestration, modules, and handoffs. It is **not** the Logical Research Pipeline. Changes here should not require changes to [`04-Research-Pipeline.md`](./04-Research-Pipeline.md), and vice versa.

**Numbering choice:** `04a` (not a new top-level number) because this is a companion to the logical pipeline in `04`, not a separate governance tier. Keeping `05`–`09` stable avoids renumber churn.

---

## Purpose

Define the **Runtime Execution Architecture**: the engineering components that run a research session end to end.

## Audience

Engineers implementing orchestration, workers, validators, and persistence adapters.

## Scope

In scope:

- Runtime modules and their execution order
- Ownership of Intent Analysis at runtime (explicit decision below)
- Distinction between search *strategy* (orchestration) and search *execution* (retrieval workers)

Out of scope:

- Logical product stage definitions (see `04`)
- Package folder layout (see `03` and `04b`)
- Infrastructure deployment (future Infrastructure Architecture docs)

## Status

**Versioned — v0.1** — Working hypothesis pending MVP validation.

## Table of Contents

1. [Runtime Execution Flow (v0.1)](#runtime-execution-flow-v01)
2. [Module Responsibilities](#module-responsibilities)
3. [Intent Analysis Ownership (Decision)](#intent-analysis-ownership-decision)
4. [Search Strategy vs Search Execution](#search-strategy-vs-search-execution)
5. [Relationship to Product Pipeline](#relationship-to-product-pipeline)

---

## Runtime Execution Flow (v0.1)

```
Research Orchestrator
  → Task Planner
  → Task Queue
  → Research Workers
  → Evidence Validator
  → Consensus Module
  → Conflict Module
  → Confidence Module
  → Report Builder
  → Persistence Layer
```

| Runtime module | Role |
|---|---|
| Research Orchestrator | Session entrypoint; coordinates the run; **owns Intent Analysis** |
| Task Planner | Turns clarified intent into an ordered investigation plan (search strategy) |
| Task Queue | Schedules and dispatches worker tasks |
| Research Workers | Execute retrieval (web, YouTube, docs, papers) |
| Evidence Validator | Claim/source validation |
| Consensus Module | Agreement detection |
| Conflict Module | Disagreement detection and explanation |
| Confidence Module | Confidence and unknowns assessment |
| Report Builder | Assembles the structured report |
| Persistence Layer | Stores research artifacts and knowledge over time |

---

## Module Responsibilities

<!-- Empty — detailed contracts to be authored; keep modules mutually exclusive -->

## Intent Analysis Ownership (Decision)

**Decision (v0.1):** Intent Analysis is a **responsibility of the Research Orchestrator**, not Task Planner, and not a separate runtime module.

### Reasoning

1. The Orchestrator is the session entrypoint — the only module that sees the raw user question before planning.
2. Task Planner's input should be *clarified intent*, not raw ambiguity. That keeps planning deterministic relative to intent.
3. Adding a standalone Intent module would invent a box absent from the runtime diagram and blur Orchestrator vs Planner.

### Flow

```
User question
  → Research Orchestrator (Intent Analysis)
  → Task Planner (consumes clarified intent; produces search strategy / plan)
  → Task Queue → …
```

If MVP evidence shows intent analysis needs independent scaling or reuse outside orchestration, revisit this decision and version this document — do not silently move it into Task Planner.

## Search Strategy vs Search Execution

| Concern | Owner | Notes |
|---|---|---|
| **Search strategy** — what to search, order, priority | Task Planner (under Orchestrator) | Orchestration / planning — **not** `packages/search` |
| **Search execution** — actually retrieving information | Research Workers | Retrieval only — **`packages/search`** |

Do not put strategy logic in `packages/search`. Do not put retrieval adapters in the Orchestrator/Planner.

## Relationship to Product Pipeline

| This document (`04a`) | Companion (`04`) |
|---|---|
| Runtime Architecture | Product Architecture |
| How the system runs | What the product flow is |

Mapping: [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md).
