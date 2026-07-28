# Research Pipeline

**Document:** `04-Research-Pipeline.md`  
**Version:** `v0.1`  
**Architecture Type:** Product Architecture  
**Authority:** Subordinate to Master Vision → Founder Brief → Constitution

> **Working hypothesis.** This stage sequence is expected to evolve until validated against a real MVP. Changes here do **not** require changes to Runtime Architecture (`04a`), and vice versa — they answer different questions.

---

## Purpose

Define the **Logical Research Pipeline**: what happens conceptually, and in what product order, when turning a user question into verified, organized, and actionable knowledge.

This document is **not** a runtime diagram. Execution flow lives in [`04a-Runtime-Architecture.md`](./04a-Runtime-Architecture.md).

## Audience

Product engineers, agent authors, and contributors who need the canonical research workflow.

## Scope

In scope:

- The ordered logical stages (v0.1 sequence below)
- Report structure requirements
- Product-level guarantees between stages (to be authored)

Out of scope:

- Runtime modules, queues, and workers (see `04a`)
- Package ownership mapping (see `04b`)
- Concrete prompts, vendors, schemas, UI

## Status

**Versioned — v0.1** — Working hypothesis; not constitutional. Implementation sections intentionally thin.

## Table of Contents

1. [Logical Research Pipeline (v0.1)](#logical-research-pipeline-v01)
2. [Intent Analysis](#intent-analysis)
3. [Research Planning](#research-planning)
4. [Research Delegation](#research-delegation)
5. [Evidence Collection](#evidence-collection)
6. [Evidence Verification](#evidence-verification)
7. [Consensus Analysis](#consensus-analysis)
8. [Conflict Analysis](#conflict-analysis)
9. [Confidence Assessment](#confidence-assessment)
10. [Report Generation](#report-generation)
11. [Knowledge Storage](#knowledge-storage)
12. [Report Structure](#report-structure)
13. [Pipeline Guarantees](#pipeline-guarantees)
14. [Relationship to Runtime Architecture](#relationship-to-runtime-architecture)

---

## Logical Research Pipeline (v0.1)

```
Intent Analysis
  → Research Planning
  → Research Delegation
  → Evidence Collection
  → Evidence Verification
  → Consensus Analysis
  → Conflict Analysis
  → Confidence Assessment
  → Report Generation
  → Knowledge Storage
```

| # | Stage | Product meaning |
|---|---|---|
| 1 | Intent Analysis | Clarify what the user needs to decide or understand |
| 2 | Research Planning | Define scope, sources, and investigation strategy |
| 3 | Research Delegation | Assign investigation work to specialized workers/agents |
| 4 | Evidence Collection | Retrieve material from web, YouTube, docs, papers, etc. |
| 5 | Evidence Verification | Validate claims against sources; assess reliability |
| 6 | Consensus Analysis | Detect agreement across independent sources |
| 7 | Conflict Analysis | Surface and explain disagreements without hiding them |
| 8 | Confidence Assessment | Measure and explain confidence and unknowns |
| 9 | Report Generation | Assemble a transparent research report |
| 10 | Knowledge Storage | Persist findings for long-term use |

---

## Intent Analysis

<!-- Empty — to be authored -->

## Research Planning

<!-- Empty — to be authored -->

## Research Delegation

<!-- Empty — to be authored -->

## Evidence Collection

<!-- Empty — to be authored -->

## Evidence Verification

<!-- Empty — to be authored -->

## Consensus Analysis

<!-- Empty — to be authored -->

## Conflict Analysis

<!-- Empty — to be authored -->

## Confidence Assessment

<!-- Empty — to be authored -->

## Report Generation

<!-- Empty — to be authored -->

## Knowledge Storage

<!-- Empty — to be authored -->

## Report Structure

Every research report must follow this structure:

1. Executive Summary
2. Research Objective
3. Key Findings
4. Evidence
5. Expert Consensus
6. Conflicting Evidence
7. Confidence Assessment
8. Important Unknowns
9. Recommended Next Steps
10. References

<!-- Assembly details empty — owned by packages/reporting -->

## Pipeline Guarantees

<!-- Empty — to be authored; must uphold Evidence Before Conclusions, Transparency Over Certainty, and Human Judgment First -->

## Relationship to Runtime Architecture

| This document (`04`) | Companion (`04a`) |
|---|---|
| Product Architecture | Runtime Architecture |
| What happens, conceptually | How it executes |
| Version independently | Version independently |

Traceability across both: [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md).
