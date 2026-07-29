# Packages

Purpose-based shared libraries. Names avoid brand-scoped prefixes (no `@fse/*`) so a product rename stays cheap.

**Versioned:** package boundaries are expected to evolve; they are not constitutional.

Each package has exactly one responsibility. Boundaries are mutually exclusive.

| Package | Owns | Does not own |
|---|---|---|
| [`search`](./search) | Retrieval only (web, YouTube, docs, papers) | Search strategy/planning |
| [`verification`](./verification) | Claim validation only | Consensus / conflict / confidence |
| [`reasoning`](./reasoning) | Consensus, conflict, confidence | Claim validation; retrieval |
| [`reporting`](./reporting) | Report assembly only | Memory, workspaces, knowledge graphs |
| [`memory`](./memory) | Research/knowledge persistence over time | Report formatting; project UX |
| [`workspace`](./workspace) | Projects, folders, collaboration, user context | Knowledge persistence engine |
| [`shared`](./shared) | Cross-cutting utilities, no domain knowledge | Domain models / pipeline logic |
| [`core`](./core) | Shared domain models and pure business logic | Coordination, I/O, queues |
| [`types`](./types) | Types/interfaces only | Any runtime logic |
| [`orchestration`](./orchestration) | Sequencing / delegation across packages | Pure domain models; capability logic |

**CLOSED-1:** Orchestration runtime lives in [`orchestration`](./orchestration). Domain models stay in `core`.

**OPEN remaining:** see `docs/04b-Traceability-Matrix.md` (OPEN-2, OPEN-3).

**Search collision (resolved):** strategy → plan data / Task Planner path; execution → `packages/search`.
