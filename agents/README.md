# `agents`

Home for agent definitions, runbooks, and orchestration specs that complement `docs/05-Agent-Specifications.md`.

## Agent roster (v0.1 — versioned, names unchanged)

| Agent | Primary package |
|---|---|
| Research Orchestrator | `core` (+ OPEN-1 for orchestration runtime) |
| Web Research Agent | `search` |
| YouTube Research Agent | `search` |
| Documentation Agent | `search` |
| Evidence Verification Agent | `verification` |
| Consensus Engine | `reasoning` |
| Conflict Analysis Agent | `reasoning` |
| Report Generation Agent | `reporting` |
| Knowledge Management Agent | `memory` |

Consensus Engine and Conflict Analysis Agent both map to `packages/reasoning` — agents are not renamed.

Runtime flow: `docs/04a-Runtime-Architecture.md`.  
Traceability: `docs/04b-Traceability-Matrix.md`.

## Status

Scaffold only — no agent runtime code yet. Implementation should follow the Constitution and Agent Oath.
