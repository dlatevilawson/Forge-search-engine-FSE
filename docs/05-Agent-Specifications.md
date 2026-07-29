# Agent Specifications

**Document:** `05-Agent-Specifications.md`  
**Version:** `v0.1`  
**Architecture Type:** Product Architecture  
**Authority:** Subordinate to Master Vision → Founder Brief → Constitution

> **Versioned.** The agent roster is expected to evolve. Agent *names* are not silently renamed here; package mappings are recorded so roster and system architecture stay consistent.

---

## Purpose

Define the responsibilities, boundaries, inputs, outputs, and constitutional constraints for each specialized research agent.

## Audience

Engineers implementing agent logic, prompt authors, and reviewers evaluating agent behavior against the Constitution and Agent Oath.

## Scope

In scope:

- The named agent roster (v0.1)
- Per-agent responsibility boundaries
- Mapping agents → packages (without renaming agents)
- Collaboration patterns with the Research Orchestrator

Out of scope:

- Concrete prompts and model parameters
- Runtime scheduling details (see `04a`)
- Provider-specific integrations

## Status

**Versioned — v0.1** — Roster preserved; package mappings added for boundary consistency.

## Table of Contents

1. [Agent System Overview](#agent-system-overview)
2. [Agent → Package Mapping](#agent--package-mapping)
3. [Shared Agent Constraints](#shared-agent-constraints)
4. [Research Orchestrator](#research-orchestrator)
5. [Web Research Agent](#web-research-agent)
6. [YouTube Research Agent](#youtube-research-agent)
7. [Documentation Agent](#documentation-agent)
8. [Evidence Verification Agent](#evidence-verification-agent)
9. [Consensus Engine](#consensus-engine)
10. [Conflict Analysis Agent](#conflict-analysis-agent)
11. [Report Generation Agent](#report-generation-agent)
12. [Knowledge Management Agent](#knowledge-management-agent)
13. [Agent Collaboration Map](#agent-collaboration-map)

---

## Agent System Overview

Agents are product-facing roles. Runtime modules in `04a` execute the work those roles describe. Packages in `03` own the reusable logic.

## Agent → Package Mapping

Agent names are unchanged. Multiple agents may map to one package when they share a responsibility boundary.

| Agent (name unchanged) | Primary package | Notes |
|---|---|---|
| Research Orchestrator | `orchestration` (+ `core` for intent domain models) | Owns Intent Analysis at runtime; coordinates session |
| Web Research Agent | `search` | Retrieval only — web |
| YouTube Research Agent | `search` | Retrieval only — YouTube |
| Documentation Agent | `search` | Retrieval only — documentation (and related corpus sources) |
| Evidence Verification Agent | `verification` | Claim validation only |
| Consensus Engine | `reasoning` | Shares package with Conflict Analysis Agent and confidence work |
| Conflict Analysis Agent | `reasoning` | Same package; distinct agent responsibility preserved |
| Report Generation Agent | `reporting` | Report assembly only — not memory/workspace |
| Knowledge Management Agent | `memory` | Long-term knowledge; workspace scoping via `workspace` (see OPEN-3) |

No agent was renamed. Consensus Engine and Conflict Analysis Agent both map to `packages/reasoning` by design.

## Shared Agent Constraints

<!-- Empty — to be authored; must include Constitution Article V and Agent Oath -->

## Research Orchestrator

<!-- Empty — to be authored; must include Intent Analysis ownership per 04a -->

## Web Research Agent

<!-- Empty — to be authored -->

## YouTube Research Agent

<!-- Empty — to be authored -->

## Documentation Agent

<!-- Empty — to be authored -->

## Evidence Verification Agent

<!-- Empty — to be authored -->

## Consensus Engine

<!-- Empty — to be authored; package: reasoning -->

## Conflict Analysis Agent

<!-- Empty — to be authored; package: reasoning -->

## Report Generation Agent

<!-- Empty — to be authored; must not own memory/workspace -->

## Knowledge Management Agent

<!-- Empty — to be authored; package: memory -->

## Agent Collaboration Map

<!-- Empty — to be authored -->
