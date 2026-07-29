# Forge Search Engine (FSE)

**Working identity** — "Forge Search Engine" / "FSE" is the current product name, not a confirmed permanent brand. Package and namespace names stay purpose-based so a rename remains cheap.

An **evidence-first AI research platform** that transforms information from the web into verified, organized, and actionable knowledge.

It is a **digital research organization**, not a search engine or chatbot. It investigates questions, gathers evidence, verifies claims, detects consensus and conflict, measures confidence, and produces transparent research reports.

**The platform informs. Humans decide.**

---

## Project Overview

People face more information than ever, yet remain uncertain about what is true. This platform exists to strengthen human judgment through transparent, evidence-based reasoning.

Core responsibilities:

- Web research
- YouTube research
- Evidence verification
- Consensus detection
- Conflict analysis
- Knowledge organization
- Research reports
- Long-term memory
- Project workspaces

Every conclusion should be evidence-backed, transparent, verifiable, actionable, and honest about uncertainty.

---

## Architecture Philosophy

Derived from the Master Vision's core principles:

| Principle | Meaning |
|---|---|
| **Evidence Before Conclusions** | No important conclusion without supporting evidence |
| **Transparency Over Certainty** | Acknowledge uncertainty; never fake confidence |
| **Human Judgment First** | AI informs; humans decide |
| **Truth Before Speed** | Accuracy outranks latency when they conflict |
| **Continuous Learning** | Knowledge and the system evolve with new evidence |

All engineering work must also improve at least one success metric: **Accuracy**, **Transparency**, **Trust**, **Understanding**, or **Decision Quality**.

---

## Stable vs Versioned

| Kind | What | Change policy |
|---|---|---|
| **Stable** | Master Vision (principles only), Founder Brief, Constitution, Architectural Principles (`10`), document hierarchy, naming conventions, repository structure | Change infrequently; never silently (Changelog required) |
| **Versioned** | Research Pipeline, Runtime Architecture, Agent Roster, package boundaries, internal APIs | Expected to evolve until MVP-validated |

Do not freeze implementation sequences inside constitutional documents. See [`docs/README.md`](./docs/README.md).

---

## Governance Documents

Constitutional documents (do not overwrite):

1. [`docs/00-Master-Vision.md`](./docs/00-Master-Vision.md) — root source of truth (principles)
2. [`docs/01-Founder-Brief.md`](./docs/01-Founder-Brief.md) — mission, problem, promise
3. [`docs/02-Constitution.md`](./docs/02-Constitution.md) — binding values and constraints

Architecture and standards docs (`03` onward) are subordinate and mostly **versioned**. See [`docs/README.md`](./docs/README.md).

### Architecture type taxonomy

Every architecture doc declares one of: **Product**, **System**, **Runtime**, or **Infrastructure**. Product pipeline (`04`) and runtime execution (`04a`) are separate artifacts on purpose.

---

## Repository Structure

```
apps/
  web/                 # Primary web client (not bootstrapped yet)
packages/
  search/              # Retrieval only (web, YouTube, docs, papers)
  verification/        # Claim validation only
  reasoning/           # Consensus, conflict, confidence
  reporting/           # Report assembly only
  memory/              # Research/knowledge persistence over time
  workspace/           # Projects, folders, collaboration, user context
  shared/              # Cross-cutting utilities (no domain knowledge)
  core/                # Shared domain models and pure business logic
  types/               # TypeScript types/interfaces only
  orchestration/       # Sequencing/delegation (stub slice; OPEN-1 evidence)
agents/                # Agent definitions and runbooks
database/              # Schemas and migrations (vendor deferred)
docs/                  # Governance + architecture documentation
scripts/               # Repository automation
tests/                 # Cross-cutting / integration tests
.github/               # GitHub workflows and templates (deferred)
```

Package scopes: [`packages/README.md`](./packages/README.md).  
Stage → runtime → package mapping: [`docs/04b-Traceability-Matrix.md`](./docs/04b-Traceability-Matrix.md).  
Architectural principles (stable): [`docs/10-Architectural-Principles.md`](./docs/10-Architectural-Principles.md).

Stub vertical slice (hardcoded query, all ten stages):

```bash
pnpm install
pnpm vertical-slice
```

---

## Development Principles

1. **Traceability** — structural choices map to Master Vision → Founder Brief → Constitution.
2. **Modularity** — one responsibility per package; no blurred boundaries.
3. **No overengineering** — build only what the current phase requires.
4. **No placeholder application code** — scaffolds are documentation and folders until real implementation begins.
5. **Brand isolation** — keep "FSE" naming at top-level surfaces; use purpose-based package names.
6. **Never silently decide open architecture questions** — mark **OPEN** and resolve deliberately.
7. **Do not conflate product pipeline with runtime** — version `04` and `04a` independently.

---

## Current Project Status

**Phase 0 — Engineering Foundation** (architecture reconciliation in progress)

Completed:

- Constitutional document hierarchy (principles vs versioned implementation split)
- Logical pipeline (`04` v0.1) separated from runtime architecture (`04a` v0.1)
- Nine single-responsibility packages documented
- Traceability matrix with explicit OPEN items (`04b`)

Not started (intentionally deferred):

- Application frameworks (e.g. Next.js)
- Database vendors (e.g. Supabase)
- Package installation / dependency graphs
- Feature / orchestrator implementation

---

## Future Roadmap

High-level sequencing (details in [`docs/08-Roadmap.md`](./docs/08-Roadmap.md)):

0. Engineering foundation ← **current**
1. Core research loop (question → collection → early reports)
2. Verification, consensus, and conflict analysis
3. Full report fidelity and knowledge memory
4. Project workspaces and continuous knowledge updates

Logical pipeline (versioned): [`docs/04-Research-Pipeline.md`](./docs/04-Research-Pipeline.md).  
Runtime execution (versioned): [`docs/04a-Runtime-Architecture.md`](./docs/04a-Runtime-Architecture.md).

---

## How to Contribute

1. Read the governance trio before proposing structural changes.
2. Prefer small, reviewable changes that strengthen package boundaries.
3. Update the traceability matrix when changing pipeline stages, runtime modules, or package ownership.
4. Do not add application frameworks or vendors unless the relevant architecture doc supports the choice.
5. Ensure changes improve at least one success metric — or do not ship them.

Contribution tooling (issue templates, CI, codeowners) will land as engineering standards are filled in (`docs/09-Engineering-Standards.md`).

---

## License

See [`LICENSE`](./LICENSE).
