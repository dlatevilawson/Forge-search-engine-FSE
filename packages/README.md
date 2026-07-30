# Packages

Purpose-based shared libraries. Names avoid brand-scoped prefixes (no `@fse/*`).

**Versioned:** package boundaries evolve; they are not constitutional.

| Package | Owns | Does not own |
|---|---|---|
| [`search`](./search) | Retrieval only | Search strategy/planning |
| [`verification`](./verification) | Claim validation façade | Consensus / conflict / confidence |
| [`reasoning`](./reasoning) | Consensus, conflict, confidence | Claim validation; retrieval |
| [`reporting`](./reporting) | Report assembly only | Memory, workspaces, knowledge graphs |
| [`memory`](./memory) | Research/knowledge persistence | Report formatting; project UX |
| [`workspace`](./workspace) | Projects, folders, collaboration | Knowledge persistence engine |
| [`shared`](./shared) | Cross-cutting utilities | Domain / pipeline logic |
| [`core`](./core) | Domain models + Research/Execution Planners (pure) | Dispatch / side effects |
| [`types`](./types) | Types/interfaces only | Runtime logic |
| [`orchestration`](./orchestration) | Research Orchestrator + coordination (CLOSED-1) | Capability algorithms |

**CLOSED-1:** Orchestration runtime lives in [`orchestration`](./orchestration). Planners stay in `core`.

**OPEN remaining:** OPEN-2, OPEN-3 — see `docs/04b-Traceability-Matrix.md`.

**Search collision (resolved):** strategy → Research Planner; execution → `search`.
