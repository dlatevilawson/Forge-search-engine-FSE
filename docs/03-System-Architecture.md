# System Architecture

**Document:** `03-System-Architecture.md`  
**Version:** `v0.2`  
**Architecture Type:** System Architecture  
**Authority:** Subordinate to Master Vision → Founder Brief → Constitution

---

## Purpose

Define the high-level **system** architecture: software components, package boundaries, and their relationships — distinct from product workflow (`04`) and runtime execution (`04a`).

## Audience

Founding engineers, architects, and contributors who need a shared mental model of the codebase before implementing features.

## Scope

In scope:

- Monorepo layout and single-responsibility package boundaries
- Application surfaces (`apps/*`)
- Cross-cutting concerns (`shared`, `types`)
- Alignment with success metrics: Accuracy, Transparency, Trust, Understanding, Decision Quality

Out of scope:

- Logical pipeline stages (see `04`)
- Runtime module flow (see `04a`)
- Database schemas and deployment (Infrastructure Architecture — see `06` placeholder)
- API contracts (see `07`)

## Status

**Versioned — v0.2** — `orchestration` confirmed (CLOSED-1); Mental Model section added.

## Table of Contents

1. [Mental Model](#mental-model)
2. [Architectural Goals](#architectural-goals)
3. [Monorepo Overview](#monorepo-overview)
4. [Package Boundaries](#package-boundaries)
5. [Application Surfaces](#application-surfaces)
6. [Data & Storage Boundaries](#data--storage-boundaries)
7. [Cross-Cutting Concerns](#cross-cutting-concerns)
8. [Open Architectural Questions](#open-architectural-questions)
9. [Evolution Principles](#evolution-principles)

---

## Mental Model

Treat the system’s shape as an **evidence compiler**:

```
Intent → Research Plan → Execution Plan → Pipeline → Evidence → Reasoning → Report
```

Analogous to a compiler pipeline (source → parse → AST → optimization → codegen): each stage transforms a structured intermediate representation toward a transparent research artifact.

**Limit of the analogy (do not ignore):** Unlike a compiler, this system does **not** treat a completed research artifact as final. Per the Master Vision’s **Continuous Learning** principle, previously completed research must be revisited and potentially updated when **new evidence emerges** — even when the original “source” (the user’s question) did not change. A compiler typically reprocesses only when its input changes; this system must sometimes reprocess when **the world** changes instead. Do not assume a strictly linear, one-shot pipeline.

---

## Architectural Goals

<!-- Empty — to be authored; scalability, maintainability, modularity, readability, DX -->

## Monorepo Overview

```
apps/
  web/                 # Primary web client (not bootstrapped yet)
packages/
  search/              # Retrieval only
  verification/        # Claim validation only
  reasoning/           # Consensus, conflict, confidence
  reporting/           # Report assembly only
  memory/              # Research/knowledge persistence over time
  workspace/           # Projects, folders, collaboration, user context
  shared/              # Utilities with no domain knowledge
  core/                # Domain models + pure planners (no I/O, no coordination)
  types/               # Types/interfaces only
  orchestration/       # Confirmed coordination package (CLOSED-1)
agents/                # Specs/runbooks only — not runtime code
database/              # Schemas/migrations (vendor deferred)
```

Brand-neutral package names only — no `@fse/*` scoping.

## Package Boundaries

Each package has exactly one responsibility. Boundaries are mutually exclusive.

| Package | Owns | Does **not** own |
|---|---|---|
| `search` | Retrieval execution (web, YouTube, docs, papers) | Search *strategy*/planning; verification; reasoning; reports |
| `verification` | Claim validation against sources | Consensus/conflict/confidence; retrieval; report assembly |
| `reasoning` | Consensus, conflict analysis, confidence assessment | Claim validation; retrieval; persistence; workspaces |
| `reporting` | Report generation/assembly only | Memory, workspaces, knowledge graphs, retrieval, verification |
| `memory` | Persistence and retrieval of research/knowledge over time | Report formatting; project/folder UX; claim validation |
| `workspace` | Projects, folders, saved research, collaboration, user context | Knowledge persistence engine; report assembly; retrieval |
| `shared` | Cross-cutting utilities with no domain knowledge | Any domain model or pipeline logic |
| `core` | Domain models + **Research Planner** + **Execution Planner** + pure intent logic | Dispatch, retries, worker calls, capability algorithms |
| `types` | Type/interface definitions only | Runtime logic of any kind |
| `orchestration` | **Confirmed** coordination home (CLOSED-1) — see ownership below | Search, verification, reasoning, reporting, persistence logic |

### `packages/orchestration` (confirmed)

**Owns:** intent routing; execution-plan **dispatch**; task scheduling; worker coordination; pipeline sequencing; failure recovery; retry policy (as executed behavior).

**Does not own:** search, verification, reasoning, reporting, or persistence. It coordinates calls into those packages; it does not implement their logic.

**Pure planners live in `core`:** Research Planner and Execution Planner produce plans; only Research Orchestrator (in `orchestration`) has side effects.

**Search naming collision (resolved):**

- **Search execution** → `packages/search`
- **Search strategy** → Research Planner (`core`) via Research Plan

Detailed per-package READMEs: `packages/*/README.md`. Stage mapping: [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md).

## Application Surfaces

<!-- Empty — to be authored -->

## Data & Storage Boundaries

Logical persistence for research knowledge → `packages/memory`.  
Project/collaboration models → `packages/workspace`.  
Physical database/vendor choices → Infrastructure Architecture (`06`) — not decided here.

`reporting` must not re-absorb memory, workspace, or knowledge-graph responsibilities.

## Cross-Cutting Concerns

<!-- Empty — to be authored -->

## Open Architectural Questions

Tracked in [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md):

- **CLOSED-1** (was OPEN-1) — Orchestration lives in `packages/orchestration` (confirmed)
- **OPEN-2** — Verification-adjacent scoring vs `reasoning`
- **OPEN-3** — Workspace-scoped knowledge persistence ownership

Do not silently resolve remaining OPEN items during implementation scaffolding.

## Evolution Principles

<!-- Empty — to be authored -->
