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

## Governance Documents

Constitutional documents (do not overwrite):

1. [`docs/00-Master-Vision.md`](./docs/00-Master-Vision.md) — root source of truth
2. [`docs/01-Founder-Brief.md`](./docs/01-Founder-Brief.md) — mission, problem, promise
3. [`docs/02-Constitution.md`](./docs/02-Constitution.md) — binding values and constraints

Architecture and standards docs (`03`–`09`) are subordinate to that hierarchy. See [`docs/README.md`](./docs/README.md).

---

## Repository Structure

```
apps/
  web/                 # Primary web client (not bootstrapped yet)
packages/
  ai/                  # Model/agent orchestration and prompting
  core/                # Shared business logic and domain models
  reporting/           # Research report assembly and formatting
  search/              # Web and source-discovery logic
  shared/              # Cross-cutting utilities (no domain knowledge)
  types/               # TypeScript types/interfaces only
agents/                # Agent definitions and runbooks
database/              # Schemas and migrations (vendor deferred)
docs/                  # Governance + architecture documentation
scripts/               # Repository automation
tests/                 # Cross-cutting / integration tests
.github/               # GitHub workflows and templates (deferred)
```

Package scopes are defined in [`packages/README.md`](./packages/README.md).

**Open architectural question:** where should evidence verification, consensus, and conflict-detection logic live — `packages/ai` or a future `packages/verification`? Flagged in system architecture docs; not decided at scaffolding time.

---

## Development Principles

1. **Traceability** — every structural choice should map to Master Vision → Founder Brief → Constitution.
2. **Modularity** — clear package boundaries; no blurred responsibilities.
3. **No overengineering** — build only what the current phase requires.
4. **No placeholder application code** — scaffolds are documentation and folders until real implementation begins.
5. **Brand isolation** — keep "FSE" / product naming at top-level surfaces; use purpose-based package names.
6. **Never silently decide open architecture questions** — record them and resolve deliberately.

---

## Current Project Status

**Phase 0 — Engineering Foundation**

Completed:

- Constitutional document hierarchy established
- Monorepo folder structure created
- Package responsibility boundaries documented
- Architecture document placeholders (`03`–`09`) created

Not started (intentionally deferred):

- Application frameworks (e.g. Next.js)
- Database vendors (e.g. Supabase)
- Package installation / dependency graphs
- Feature implementation

---

## Future Roadmap

High-level sequencing (details in [`docs/08-Roadmap.md`](./docs/08-Roadmap.md)):

0. Engineering foundation ← **current**
1. Core research loop (question → collection → early reports)
2. Verification, consensus, and conflict analysis
3. Full report fidelity and knowledge memory
4. Project workspaces and continuous knowledge updates

Research pipeline stages and report structure are locked to the Master Vision — see [`docs/04-Research-Pipeline.md`](./docs/04-Research-Pipeline.md).

---

## How to Contribute

1. Read the governance trio before proposing structural changes.
2. Prefer small, reviewable changes that strengthen package boundaries.
3. Document architectural decisions; do not bury them in code.
4. Do not add application frameworks or vendors unless the relevant architecture doc supports the choice.
5. Ensure changes improve at least one success metric — or do not ship them.

Contribution tooling (issue templates, CI, codeowners) will land as engineering standards are filled in (`docs/09-Engineering-Standards.md`).

---

## License

See [`LICENSE`](./LICENSE).
