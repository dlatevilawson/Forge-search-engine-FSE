# Traceability Matrix

**Document:** `04b-Traceability-Matrix.md`  
**Version:** `v0.2`  
**Architecture Type:** Product Architecture + Runtime Architecture + System Architecture (cross-cutting)  
**Authority:** Subordinate to Master Vision → Founder Brief → Constitution

> Maps every Logical Research Pipeline stage → runtime module(s) → owning package.  
> **Rule:** zero silent gaps. If ownership is undecided, mark **OPEN**.

**Numbering choice:** `04b` companions `04` / `04a` so the product/runtime/system mapping stays adjacent without renumbering `05`–`09`.

---

## Purpose

Provide a single place to verify that product stages, runtime modules, and package boundaries stay aligned as the architecture evolves.

## Audience

Architects and founding engineers reviewing changes to pipeline, runtime, or packages.

## Status

**Versioned — v0.2** — OPEN-1 closed (`packages/orchestration`). OPEN-2 and OPEN-3 remain open.

## Table of Contents

1. [Matrix (v0.2)](#matrix-v02)
2. [Supporting packages (not stage owners)](#supporting-packages-not-stage-owners)
3. [Closed decisions](#closed-decisions)
4. [OPEN decisions](#open-decisions)
5. [Update rules](#update-rules)

---

## Matrix (v0.2)

Logical stages from [`04-Research-Pipeline.md`](./04-Research-Pipeline.md). Runtime modules from [`04a-Runtime-Architecture.md`](./04a-Runtime-Architecture.md). Packages from [`03-System-Architecture.md`](./03-System-Architecture.md).

| # | Logical stage | Runtime module(s) | Owning package | Status |
|---|---|---|---|---|
| 1 | Intent Analysis | Research Orchestrator *(owns intent analysis)* | `orchestration` *(runtime)* + `core` *(intent domain models)* | Mapped |
| 2 | Research Planning | Task Planner | `orchestration` *(planner/coordination)* + `core` *(plan domain models)* | Mapped |
| 3 | Research Delegation | Task Queue (+ Research Orchestrator) | `orchestration` | Mapped |
| 4 | Evidence Collection | Research Workers | `search` | Mapped |
| 5 | Evidence Verification | Evidence Validator | `verification` | Mapped — see OPEN-2 for boundary with reasoning |
| 6 | Consensus Analysis | Consensus Module | `reasoning` | Mapped |
| 7 | Conflict Analysis | Conflict Module | `reasoning` | Mapped |
| 8 | Confidence Assessment | Confidence Module | `reasoning` | Mapped — see OPEN-2 |
| 9 | Report Generation | Report Builder | `reporting` | Mapped |
| 10 | Knowledge Storage | Persistence Layer | `memory` | Mapped — see OPEN-3 for workspace-scoped persistence |

**Unmapped logical stages:** none.

---

## Supporting packages (not stage owners)

These packages are required by the system but do not own a pipeline stage:

| Package | Role relative to the pipeline |
|---|---|
| `workspace` | Projects, folders, saved research, collaboration, user context — may *supply context* to Intent Analysis and *scope* Knowledge Storage; does not own those stages |
| `shared` | Cross-cutting utilities; no domain ownership |
| `types` | Type/interface definitions only; no logic ownership |

---

## Closed decisions

### CLOSED-1 (was OPEN-1) — Orchestration / Task Queue package home

**Decision:** Implementation of Research Orchestrator, Task Planner, Task Queue, and Research Delegation lives in **`packages/orchestration`**.

**Split with `core`:**

| Concern | Package |
|---|---|
| Intent / plan / session **domain models** and pure transforms | `packages/core` |
| Sequencing, delegation, retries, cancellation, cross-package coordination | `packages/orchestration` |

**Rejected:**

- B. `agents/` / `apps/` only — fine for a one-off CLI entrypoint, not for reusable orchestration
- C. Stretching `core` — violates Architectural Principles Principle 8 (core has no coordination / side effects)

**Evidence:** Stub vertical slice could not place the stage sequencer or Research Delegation in `core` without violating Principle 8; `packages/orchestration` was the natural home.

**Closed:** 2026-07-29 (founder directive: CLOSE OPEN-1).

---

## OPEN decisions

### OPEN-2 — Verification-adjacent scoring vs reasoning

**Question:** Where does source/claim credibility scoring live when it feeds both Evidence Verification and Confidence Assessment?

**Context:** Pure claim validation → `verification`. Consensus/conflict/confidence → `reasoning`. Scoring that is shared input to both can blur the boundary.

**Options (not chosen):**

- A. Keep scoring inside `verification`; `reasoning` consumes verification outputs only
- B. Place shared scoring primitives in `core`; both packages consume them
- C. Allow a narrow shared module inside `reasoning` that verification may not import (directional dependency)

**Founder input required before implementing credibility scoring.**

### OPEN-3 — Workspace-scoped knowledge persistence

**Question:** When knowledge is stored *inside* a project workspace, does `memory` own the persistence API with `workspace` as a scope key, or does `workspace` own project-scoped storage and call `memory`?

**Default lean (non-binding):** `memory` owns all research/knowledge persistence; `workspace` owns project/folder/collaboration models and passes scope identifiers. Confirm before implementing.

**Founder input required before implementing project-scoped storage.**

---

## Update rules

1. Every change to `04` stages or `04a` modules must update this matrix in the same change.
2. Never leave a logical stage without a row.
3. Prefer **OPEN** over a guess.
4. Do not let `reporting` absorb memory, workspace, or knowledge-graph responsibilities.
5. Closed decisions stay in this document; do not delete history — move OPEN → Closed with date and rationale.
