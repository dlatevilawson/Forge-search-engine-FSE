# Traceability Matrix

**Document:** `04b-Traceability-Matrix.md`  
**Version:** `v0.1`  
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

**Versioned — v0.1** — Reflects pipeline `04` v0.1, runtime `04a` v0.1, and the nine-package system layout.

## Table of Contents

1. [Matrix (v0.1)](#matrix-v01)
2. [Supporting packages (not stage owners)](#supporting-packages-not-stage-owners)
3. [OPEN decisions](#open-decisions)
4. [Update rules](#update-rules)

---

## Matrix (v0.1)

Logical stages from [`04-Research-Pipeline.md`](./04-Research-Pipeline.md). Runtime modules from [`04a-Runtime-Architecture.md`](./04a-Runtime-Architecture.md). Packages from [`03-System-Architecture.md`](./03-System-Architecture.md).

| # | Logical stage | Runtime module(s) | Owning package | Status |
|---|---|---|---|---|
| 1 | Intent Analysis | Research Orchestrator *(owns intent analysis)* | `core` *(intent/session domain models)* | Mapped — see OPEN-1 for orchestration *code* home |
| 2 | Research Planning | Task Planner | `core` *(plan/strategy domain models)* | Mapped — see OPEN-1 |
| 3 | Research Delegation | Task Queue (+ Research Orchestrator) | **OPEN** | **OPEN-1** — no orchestration/queue package in the nine-package set |
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

## OPEN decisions

### OPEN-1 — Orchestration / Task Queue package home

**Question:** Where does implementation of Research Orchestrator, Task Planner, and Task Queue live as code?

**Context:** Intent Analysis and Research Planning domain models map cleanly to `packages/core`. Research Delegation (queue, dispatch, worker scheduling) does not cleanly fit any of the nine packages (`search`, `verification`, `reasoning`, `reporting`, `memory`, `workspace`, `shared`, `core`, `types`).

**Options (not chosen):**

- A. Add a future `packages/orchestration` (or similar) — expands the package set
- B. Keep orchestration as app/agent runtime code under `agents/` / `apps/`, depending on `core` for domain models
- C. Stretch `core` to include queue/dispatch (risk: `core` becomes a catch-all)

**Founder input required before implementation of delegation/queue code.**

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
