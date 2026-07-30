# Traceability Matrix

**Document:** `04b-Traceability-Matrix.md`  
**Version:** `v0.4`  
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

**Versioned — v0.4** — Real web retrieval in `packages/search`; Evidence Collection failure-handling note added. OPEN-2 and OPEN-3 remain open.

## Table of Contents

1. [Matrix (v0.4)](#matrix-v04)
2. [Evidence Collection — real retrieval notes](#evidence-collection--real-retrieval-notes)
3. [Supporting packages (not stage owners)](#supporting-packages-not-stage-owners)
4. [Closed decisions](#closed-decisions)
5. [OPEN decisions](#open-decisions)
6. [Update rules](#update-rules)

---

## Matrix (v0.4)

Logical stages from [`04-Research-Pipeline.md`](./04-Research-Pipeline.md). Runtime modules from [`04a-Runtime-Architecture.md`](./04a-Runtime-Architecture.md). Packages from [`03-System-Architecture.md`](./03-System-Architecture.md).

| # | Logical stage | Runtime module(s) | Owning package | Status |
|---|---|---|---|---|
| 1 | Intent Analysis | Research Orchestrator *invokes* pure `analyzeIntent` | `core` *(logic)* + `orchestration` *(invocation)* | Mapped |
| 2 | Research Planning | Research Planner | `core` | Mapped |
| 3 | Research Delegation | Execution Planner → Research Orchestrator (dispatch) | `core` *(Execution Plan)* + `orchestration` *(dispatch)* | Mapped |
| 4 | Evidence Collection | Research Workers | `search` | Mapped — **web real**; see notes below |
| 5 | Evidence Verification | Evidence Validator | `verification` | Mapped — see OPEN-2 |
| 6 | Consensus Analysis | Consensus Module | `reasoning` | Mapped |
| 7 | Conflict Analysis | Conflict Module | `reasoning` | Mapped |
| 8 | Confidence Assessment | Confidence Module | `reasoning` | Mapped — see OPEN-2 |
| 9 | Report Generation | Report Builder | `reporting` | Mapped |
| 10 | Knowledge Storage | Persistence Layer | `memory` | Mapped — see OPEN-3 |

**Unmapped logical stages:** none.  
**Retired runtime name:** Task Planner — do not use.

---

## Evidence Collection — real retrieval notes

**Pass (2026-07-30):** Replaced web stub with real DuckDuckGo HTML retrieval. Contract: `SearchResult` / `SearchOutcome` in `packages/types`. YouTube/docs/papers remain unimplemented (`hard-error`).

### Failure modes exercised

| Mode | How | Orchestration behavior |
|---|---|---|
| **success** | Hardcoded boiling-point query against DuckDuckGo HTML (GET) | Collected real hits; adapted to `EvidenceCandidate` for stub verification |
| **transient-error** | `SEARCH_FORCE_FAILURE=transient-error`; also observed live HTTP 202 bot interstitial on POST (now treated as transient) | Retried up to `maxAttempts` (3) then returned final transient outcome — **no new powers needed** |
| **no-results** | `SEARCH_FORCE_FAILURE=no-results` | Single attempt; **not** retried — **no new powers needed** |
| **hard-error** | `SEARCH_FORCE_FAILURE=hard-error` | Single attempt; **not** retried — **no new powers needed** |

### Boundary check (OPEN-1 ownership)

- `packages/search` does **not** retry; it only returns typed outcomes.
- `packages/orchestration` owns retry (transient only) and whether to abort the slice when zero results remain.

**Held up:** Existing CLOSED-1 split was sufficient for these modes.

**Observation (not absorbed silently):** When *all* tasks end in no-results/hard-error/exhausted transient, the slice currently **throws** in Evidence Collection. That is a blunt “abort session” policy, not a productized recovery path (e.g. degrade, ask user, or widen sources). If founders want structured session-level failure outcomes (not exceptions), that is a **new** orchestration API shape — do not invent it inside `search`.

**OPEN-2 / OPEN-3:** untouched this pass.

---

## Supporting packages (not stage owners)

| Package | Role relative to the pipeline |
|---|---|
| `workspace` | Projects, folders, saved research, collaboration, user context — may *supply context* to Intent Analysis and *scope* Knowledge Storage; does not own those stages |
| `shared` | Cross-cutting utilities; no domain ownership |
| `types` | Type/interface definitions only; no logic ownership |

---

## Closed decisions

### CLOSED-1 (was OPEN-1) — Orchestration package home

**Decision:** `packages/orchestration` is confirmed as the home for coordination.

**Rationale:**

- The vertical slice showed coordination cannot live in `core` without violating Principle 8 (core/orchestration boundary).
- `agents/` remains specs/runbooks only, not runtime code.
- The slice’s sequencing, dispatching, and coordination needs required a real home, and `orchestration` was it.

**`packages/orchestration` owns:**

- Intent routing (invoking intent analysis and planners)
- Execution planning **dispatch** (running an Execution Plan — not writing it)
- Task scheduling
- Worker coordination
- Pipeline sequencing
- Failure recovery
- Retry policy (as executed behavior)

**`packages/orchestration` does not own:** search, verification, reasoning, reporting, or persistence. It coordinates calls into those packages; it does not implement their logic.

**Pure planners (not orchestration):**

| Component | Package |
|---|---|
| Research Planner (Research Plan) | `packages/core` |
| Execution Planner (Execution Plan) | `packages/core` |
| Intent Analysis logic | `packages/core` |

**Rejected:**

- B. `agents/` / `apps/` as the only home for reusable orchestration
- C. Stretching `core` to include dispatch / side effects

**Closed:** 2026-07-29 (founder directive). Ownership boundary refined 2026-07-29 with planner split.

---

## OPEN decisions

### OPEN-2 — Verification-adjacent scoring vs reasoning

**Question:** Where does source/claim credibility scoring live when it feeds both Evidence Verification and Confidence Assessment?

**Context:** Pure claim validation → `verification`. Consensus/conflict/confidence → `reasoning`. Scoring that is shared input to both can blur the boundary.

**Options (not chosen):**

- A. Keep scoring inside `verification`; `reasoning` consumes verification outputs only (`EvidenceAttributes`)
- B. Place shared scoring primitives in `core`; both packages consume them
- C. Allow a narrow shared module inside `reasoning` that verification may not import (directional dependency)

**Experiment (not a decision):** Verification façade — orchestration calls only `verifyEvidence()`; `scoreCredibility` is private inside verification. Reasoning uses `EvidenceAttributes` only. See latest pass notes; **OPEN-2 stays OPEN**.

**Founder input required before closing.**

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
