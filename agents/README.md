# `agents`

Home for agent definitions, runbooks, and orchestration **specs** (not runtime code). Runtime lives in `packages/orchestration`.

## Agent roster (v0.1 — versioned, names unchanged)

| Agent | Primary package |
|---|---|
| Research Orchestrator | `orchestration` (+ `core` for intent + Research/Execution Planners) |
| Web Research Agent | `search` |
| YouTube Research Agent | `search` |
| Documentation Agent | `search` |
| Evidence Verification Agent | `verification` |
| Consensus Engine | `reasoning` |
| Conflict Analysis Agent | `reasoning` |
| Report Generation Agent | `reporting` |
| Knowledge Management Agent | `memory` |

**Task Planner is retired.** Use Research Planner + Execution Planner (`core`) and Research Orchestrator (`orchestration`).

Runtime flow: `docs/04a-Runtime-Architecture.md`.  
Traceability: `docs/04b-Traceability-Matrix.md`.

## Status

Scaffold only — no agent runtime code here. Implementation follows the Constitution and Agent Oath.
