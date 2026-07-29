# Documentation

Governance and architecture documents for the research platform.

## Stable vs Versioned

Not everything in `docs/` has the same change policy.

### Stable (change infrequently, never silently)

- Master Vision — **principles only** (`00-Master-Vision.md`)
- Founder Brief (`01-Founder-Brief.md`)
- Constitution (`02-Constitution.md`)
- Architectural Principles (`10-Architectural-Principles.md`) — Governance
- Document hierarchy and numbering conventions
- Naming conventions (brand-neutral packages)
- Repository structure (top-level layout)

Stable documents are not frozen. Any edit must append a dated one-line **Changelog** entry (see `10-Architectural-Principles.md`). Do not pin implementation sequences inside Master Vision.

### Versioned (expected to evolve until MVP-validated)

- Research Pipeline — Product Architecture (`04`, currently `v0.1`)
- Runtime Architecture (`04a`, currently `v0.1`)
- Traceability Matrix (`04b`, currently `v0.1`)
- Agent Roster (`05`, currently `v0.1`)
- Package boundaries / System Architecture (`03`, currently `v0.1`)
- Internal APIs (`07`)
- Database / infrastructure details (`06`)

Versioned docs may change without amending constitutional principles. Product pipeline and runtime architecture version independently.

---

## Architecture Type Taxonomy

Every architecture document must declare its type in the header:

| Type | Answers | Examples |
|---|---|---|
| **Product Architecture** | Business capabilities and user-facing workflows | Logical Research Pipeline (`04`) |
| **System Architecture** | Software components and relationships | Package structure (`03`) |
| **Runtime Architecture** | Execution flow and orchestration | Runtime Execution (`04a`) |
| **Infrastructure Architecture** | Deployment, storage, networking, operations | Database (`06`) — placeholder |
| **Governance** | Stable engineering rules binding versioned work | Architectural Principles (`10`) |

Do not merge product and runtime diagrams into one artifact.

---

## Governance Hierarchy

Documents are authoritative in this order. Do not overwrite constitutional content.

| Order | Document | Role |
|---|---|---|
| 0 | [`00-Master-Vision.md`](./00-Master-Vision.md) | Root source of truth (principles) |
| 1 | [`01-Founder-Brief.md`](./01-Founder-Brief.md) | Founder mission, problem, promise |
| 2 | [`02-Constitution.md`](./02-Constitution.md) | Binding values, constraints, agent oath |

## Architecture & Engineering Docs

| Document | Architecture Type | Status |
|---|---|---|
| [`03-System-Architecture.md`](./03-System-Architecture.md) | System | Versioned `v0.1` |
| [`04-Research-Pipeline.md`](./04-Research-Pipeline.md) | Product | Versioned `v0.1` |
| [`04a-Runtime-Architecture.md`](./04a-Runtime-Architecture.md) | Runtime | Versioned `v0.1` |
| [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md) | Cross-cutting | Versioned `v0.1` |
| [`05-Agent-Specifications.md`](./05-Agent-Specifications.md) | Product | Versioned `v0.1` |
| [`06-Database-Architecture.md`](./06-Database-Architecture.md) | Infrastructure | Placeholder |
| [`07-API-Architecture.md`](./07-API-Architecture.md) | System | Placeholder |
| [`08-Roadmap.md`](./08-Roadmap.md) | — (planning) | Placeholder |
| [`09-Engineering-Standards.md`](./09-Engineering-Standards.md) | — (standards) | Placeholder |
| [`10-Architectural-Principles.md`](./10-Architectural-Principles.md) | Governance | Stable |

Everything below the constitutional documents must remain traceable to Master Vision → Founder Brief → Constitution (and, for engineering structure, Architectural Principles).
