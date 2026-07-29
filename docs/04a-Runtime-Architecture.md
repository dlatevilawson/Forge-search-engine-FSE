# Runtime Architecture

**Document:** `04a-Runtime-Architecture.md`  
**Version:** `v0.2`  
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
- Placement of Research Planner / Execution Planner / Research Orchestrator
- Ownership of Intent Analysis at runtime
- Distinction between search *strategy* (planning) and search *execution* (retrieval workers)

Out of scope:

- Logical product stage definitions (see `04`)
- Package folder layout (see `03` and `04b`)
- Infrastructure deployment (future Infrastructure Architecture docs)

## Status

**Versioned — v0.2** — Task Planner retired; Research Planner / Execution Planner / Research Orchestrator split.

## Table of Contents

1. [Runtime Execution Flow (v0.2)](#runtime-execution-flow-v02)
2. [Planner / Orchestrator Split](#planner--orchestrator-split)
3. [Module Responsibilities](#module-responsibilities)
4. [Intent Analysis Ownership (Decision)](#intent-analysis-ownership-decision)
5. [Search Strategy vs Search Execution](#search-strategy-vs-search-execution)
6. [Relationship to Product Pipeline](#relationship-to-product-pipeline)

---

## Runtime Execution Flow (v0.2)

```
[core — pure]
  Research Planner
    → Execution Planner

[orchestration — side effects]
  Research Orchestrator
    → Task Queue
    → Research Workers
    → Evidence Validator
    → Consensus Module
    → Conflict Module
    → Confidence Module
    → Report Builder
    → Persistence Layer
```

| Runtime module | Layer / package | Role |
|---|---|---|
| Research Planner | `core` (pure) | Intent → Research Plan (sources, order, depth) |
| Execution Planner | `core` (pure) | Research Plan → Execution Plan (task list + retry params) |
| Research Orchestrator | `orchestration` | Runs an Execution Plan: dispatch, sequence, retries, failures |
| Task Queue | `orchestration` | Schedules and dispatches worker tasks |
| Research Workers | `search` | Execute retrieval (web, YouTube, docs, papers) |
| Evidence Validator | `verification` | Claim/source validation (façade) |
| Consensus Module | `reasoning` | Agreement detection |
| Conflict Module | `reasoning` | Disagreement detection and explanation |
| Confidence Module | `reasoning` | Confidence and unknowns assessment |
| Report Builder | `reporting` | Assembles the structured report |
| Persistence Layer | `memory` | Stores research artifacts and knowledge over time |

**Retired name:** "Task Planner" — replaced by Research Planner + Execution Planner + Research Orchestrator. Do not reintroduce it.

---

## Planner / Orchestrator Split

| Component | Pure? | Package | Output |
|---|---|---|---|
| Research Planner | Yes | `core` | Research Plan |
| Execution Planner | Yes | `core` | Execution Plan |
| Research Orchestrator | **No** (side effects) | `orchestration` | Running session / stage results |

Dividing line: the moment a component **causes execution** rather than **describing what should execute**, it belongs in `orchestration`, not `core`.

If Execution Planner ever needs live worker state to finish planning, **stop** and open a new OPEN item — do not silently slide it into `orchestration`.

---

## Module Responsibilities

<!-- Empty — detailed contracts to be authored; keep modules mutually exclusive -->

## Intent Analysis Ownership (Decision)

**Decision (v0.2):** Intent Analysis **logic** is a pure transform in `packages/core` (`analyzeIntent`). The **Research Orchestrator** invokes it as the session entry step, then calls Research Planner → Execution Planner → dispatch.

### Flow

```
User question
  → Research Orchestrator invokes core.analyzeIntent
  → Research Planner (core) → Research Plan
  → Execution Planner (core) → Execution Plan
  → Research Orchestrator runs Execution Plan → Task Queue → …
```

## Search Strategy vs Search Execution

| Concern | Owner | Notes |
|---|---|---|
| **Search strategy** — what to search, order, priority | Research Planner (`core`) | Encoded in Research Plan — **not** `packages/search` |
| **Dispatch shape** — task list + retry params | Execution Planner (`core`) | Encoded in Execution Plan — still pure |
| **Search execution** — actually retrieving information | Research Workers via Orchestrator | Retrieval only — **`packages/search`** |

Do not put strategy logic in `packages/search`. Do not put retrieval adapters in the planners.

## Relationship to Product Pipeline

| This document (`04a`) | Companion (`04`) |
|---|---|
| Runtime Architecture | Product Architecture |
| How the system runs | What the product flow is |

Mapping: [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md).
