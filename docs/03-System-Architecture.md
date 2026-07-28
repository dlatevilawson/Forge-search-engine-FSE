# System Architecture

**Document:** `03-System-Architecture.md`  
**Version:** `v0.1`  
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

**Versioned — v0.1** — Package boundaries are versioned (expected to evolve); not constitutional.

## Table of Contents

1. [Architectural Goals](#architectural-goals)
2. [Monorepo Overview](#monorepo-overview)
3. [Package Boundaries](#package-boundaries)
4. [Application Surfaces](#application-surfaces)
5. [Data & Storage Boundaries](#data--storage-boundaries)
6. [Cross-Cutting Concerns](#cross-cutting-concerns)
7. [Open Architectural Questions](#open-architectural-questions)
8. [Evolution Principles](#evolution-principles)

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
  core/                # Shared domain models and core business logic
  types/               # Types/interfaces only
agents/                # Agent definitions / runbooks (not a package)
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
| `core` | Shared domain models and core business logic (e.g. session/intent/plan) | Retrieval adapters; report formatters; generic utils |
| `types` | Type/interface definitions only | Runtime logic of any kind |

**Removed:** `packages/ai` as a catch-all. Orchestration prompting may live near agents/runtime; see OPEN-1 in [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md).

**Search naming collision (resolved):**

- **Search execution** → `packages/search` (Research Workers)
- **Search strategy** → Task Planner / Orchestrator runtime (not this package)

Detailed per-package READMEs live under `packages/*/README.md`. Stage mapping: [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md).

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

Tracked with full context in [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md):

- **OPEN-1** — Orchestration / Task Queue package home
- **OPEN-2** — Verification-adjacent scoring vs `reasoning`
- **OPEN-3** — Workspace-scoped knowledge persistence ownership

Do not silently resolve these during implementation scaffolding.

## Evolution Principles

<!-- Empty — to be authored -->
