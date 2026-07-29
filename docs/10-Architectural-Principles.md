# Architectural Principles

**Document:** `10-Architectural-Principles.md`  
**Architecture Type:** Governance  
**Status:** Stable (constitutional-adjacent)  
**Authority:** Subordinate to Master Vision → Founder Brief → Constitution; binding on all versioned architecture and code

> **Stable-document rule.** Stable documents change infrequently, but never silently. Any edit to a stable document must add a dated one-line entry to a **Changelog** section at the bottom of that document, stating what changed and why.

---

## Purpose

Codify engineering principles that keep package boundaries, ownership, and evolution rules unambiguous — especially where convenience tempts catch-alls (`core`, shared state, silent OPEN resolution).

## Audience

All contributors designing packages, pipeline stages, runtime modules, or data contracts.

## Scope

In scope: ownership, layering, capability vs policy, data contracts, and the `core` / `orchestration` boundary.  
Out of scope: concrete pipeline stage lists, runtime diagrams, and vendor choices (those remain versioned).

---

## Principles

### 1. Single Responsibility over Convenience

A package, module, or document should own one kind of responsibility. Do not merge neighbors because wiring them separately is slightly more work — that is how catch-alls (`ai`, overloaded `core`, bloated `reporting`) form.

### 2. Prefer explicit ownership over shared ownership

Every capability has exactly one authoritative owner. Shared ownership is not a compromise; it is deferred conflict. If two packages both appear to own a concern, mark an OPEN fork instead of dual-writing.

### 3. Open questions are documented, not guessed

Unresolved architectural decisions are marked **OPEN** with the specific fork stated. They are never silently resolved by whoever happens to be implementing. Implementation may gather evidence; founders (or an explicit decision record) close OPEN items.

### 4. Product architecture and runtime architecture evolve independently

The Logical Research Pipeline (product) and Runtime Execution Architecture answer different questions. Change one without forcing the other unless the [traceability matrix](./04b-Traceability-Matrix.md) breaks — then update the matrix in the same change.

### 5. Capabilities are separated from policies

A **capability** answers “what can the system do?” and stays relatively stable. A **policy** answers “how should it behave in this context?” and is expected to evolve.

| Capability (stable “what”) | Policy examples (evolving “how”) |
|---|---|
| **Search** | Which sources to try first; query expansion; result caps |
| **Verification** | Evidence acceptance threshold; how credibility is scored |
| **Reasoning** | How consensus is declared; how conflicts are weighted; confidence bands |
| **Reporting** | Report format; section verbosity; citation style |
| **Memory** | Retention; refresh cadence; what is indexed for recall |
| **Orchestration** | Delegation order; retries; cancellation; parallelism |
| **Workspace** | Project defaults; collaboration rules; context injected into sessions |

Capabilities live in packages (and related runtime modules). Policies configure those capabilities; they must not blur package ownership.

### 6. Packages communicate through defined data contracts, not shared internal state

When one package’s output feeds another (e.g. Verification’s evidence attributes feeding Reasoning’s weighting), the shape of that data is an **explicit, versioned interface** — typically in `packages/types` — not an implicit assumption both sides happen to share. Consumers depend on the contract, not on the producer’s internals.

### 7. Dependencies flow in one documented direction

“Core capability” (product centrality) is not the same as “innermost dependency” (import direction). A capability can be central to the product while sitting in an outer dependency layer. **Do not infer direction from product importance — use the diagram below.**

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3 — Coordination                                     │
│    orchestration   (sequences / delegates / retries)        │
│    apps / scripts  (entrypoints; may call orchestration)    │
└─────────────────────────────▲───────────────────────────────┘
                              │ may depend on Layer 2 & below
                              │ nothing in L2/L1/L0 depends on L3
┌─────────────────────────────┴───────────────────────────────┐
│  Layer 2 — Capabilities (siblings; no horizontal ownership) │
│    search | verification | reasoning | reporting            │
│    memory | workspace                                       │
│                                                             │
│  Rules:                                                     │
│  • May depend on Layer 1 and Layer 0 only                   │
│  • Must not import orchestration                            │
│  • Must not own each other’s responsibilities               │
│  • Cross-capability data flows via Layer 0 contracts        │
│  • No dependency edge between memory ↔ workspace yet        │
│    (OPEN-3) — do not invent one for convenience             │
└─────────────────────────────▲───────────────────────────────┘
                              │ may depend on Layer 1 & 0
┌─────────────────────────────┴───────────────────────────────┐
│  Layer 1 — Domain                                           │
│    core   (domain models + pure logic; no I/O; no coord.)   │
└─────────────────────────────▲───────────────────────────────┘
                              │ may depend on Layer 0
┌─────────────────────────────┴───────────────────────────────┐
│  Layer 0 — Foundations                                      │
│    types   (interfaces / contracts only)                    │
│    shared  (utilities with no domain knowledge)             │
│  types and shared must not depend on any higher layer       │
└─────────────────────────────────────────────────────────────┘
```

**Allowed:** `orchestration` → `search` | `verification` | `reasoning` | `reporting` | `memory` | `workspace` | `core` | `types` | `shared`  
**Forbidden:** `search` → `orchestration`; `verification` → `reasoning` (use `types` contracts instead); `core` → any Layer 2/3 package.

### 8. `core` vs. `orchestration` boundary

| | `packages/core` | `packages/orchestration` (when it exists) |
|---|---|---|
| Holds | Domain models and **pure** logic | Sequencing, delegation, retries, cancellation, cross-package coordination |
| Side effects | **None** | Allowed (calling other packages, queues, timers) |
| Coordinates other packages? | **No** | **Yes** |

If a piece of logic does **both** pure domain work and cross-package coordination, it does not belong in either package as-is — flag a new **OPEN** item rather than stuffing it into whichever package is more convenient.

---

## Changelog

- **2026-07-29** — Created document: stable governance principles (ownership, capability/policy, dependency diagram, core/orchestration boundary, data contracts, changelog rule for stable docs).
