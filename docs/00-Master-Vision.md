# Master Vision

**Status:** Constitutional — Root Source of Truth (principles; stable)  
**Architecture Type:** — (governance, not an architecture diagram)  
**Authority:** Highest. All other documents, and eventually all code, must be traceable back to this vision.  
**Identity note:** "Forge Search Engine" / "FSE" is the current working identity, not a confirmed permanent brand.  
**Change policy:** Stable. Do not pin versioned implementation sequences (pipeline stages, runtime modules, agent rosters, package layouts) in this document — those live in versioned architecture docs.

---

## Purpose

This document defines what the product is, why it exists, and the non-negotiable principles that govern every subsequent design and engineering decision.

---

## Mission

Help people make better decisions by transforming scattered information into verified, organized, and actionable knowledge.

---

## Vision

Build the world's most trusted AI research platform that helps people understand complex topics through evidence, transparency, and intelligent reasoning.

The platform functions as a **digital research organization**, not a search engine or chatbot. It investigates, gathers evidence, verifies claims, detects consensus and conflict, measures confidence, and produces transparent research reports.

**FSE informs; humans decide.**

---

## Problem

The internet contains more information than ever before, but finding trustworthy, complete, and unbiased knowledge has become increasingly difficult. People spend hours searching across websites, videos, forums, and documentation only to remain uncertain about what is actually true.

---

## Solution

An evidence-first AI research platform that:

- Investigates questions rather than merely answering them
- Gathers information from multiple trustworthy sources
- Evaluates evidence quality
- Identifies consensus and disagreement
- Measures and explains confidence
- Presents transparent, actionable research
- Strengthens human judgment instead of replacing it

---

## Product Responsibilities

| Capability | Description |
|---|---|
| Web research | Discover and collect evidence from the open web |
| YouTube research | Extract and evaluate claims from video sources |
| Evidence verification | Assess source quality, claim support, and reliability |
| Consensus detection | Identify where independent sources agree |
| Conflict analysis | Surface and explain disagreements without hiding them |
| Knowledge organization | Structure findings into durable, queryable knowledge |
| Research reports | Produce transparent, actionable research artifacts |
| Long-term memory | Retain and refine knowledge across sessions |
| Project workspaces | Support ongoing research within scoped projects |

---

## Core Principles

These principles are constitutional. They override convenience, speed, and short-term growth metrics.

### 1. Evidence Before Conclusions

No important conclusion should exist without supporting evidence.

### 2. Transparency Over Certainty

When uncertainty exists, acknowledge it. Prefer honest ambiguity over false confidence.

### 3. Human Judgment First

AI informs. Humans decide. The product strengthens judgment; it does not replace it.

### 4. Truth Before Speed

Fast answers are valuable. Accurate answers are essential. Speed must never compromise truthfulness.

### 5. Continuous Learning

Knowledge evolves. The platform evolves with it — through updated evidence, refined confidence, and durable memory.

---

## Success Metrics

Every improvement must increase one or more of the following. If it does not, it should not be built.

1. **Accuracy** — conclusions track reality and evidence
2. **Transparency** — reasoning, sources, and uncertainty are visible
3. **Trust** — users can verify and rely on the research process
4. **Understanding** — users leave with clearer mental models
5. **Decision Quality** — users make better-informed decisions

---

## Research Process (Principle)

Research proceeds through **structured, evidence-based, verifiable stages**. The platform investigates before concluding: it gathers evidence, verifies claims, surfaces consensus and conflict, assesses confidence, and produces transparent reports.

The **specific stage sequence** is deliberately *not* pinned here. Stage names and ordering are product architecture and will evolve until validated by a real MVP.

- Canonical logical pipeline (versioned): [`04-Research-Pipeline.md`](./04-Research-Pipeline.md)
- How that pipeline executes at runtime (versioned, separate concern): [`04a-Runtime-Architecture.md`](./04a-Runtime-Architecture.md)
- Stage → runtime → package mapping: [`04b-Traceability-Matrix.md`](./04b-Traceability-Matrix.md)

---

## Agent System (Principle)

The platform operates through **specialized agents** with clear responsibilities. Every agent must uphold the Agent Oath (see Constitution).

The **agent roster** (names, boundaries, and package mappings) is versioned product/runtime architecture — not frozen in this document.

- Canonical agent specifications (versioned): [`05-Agent-Specifications.md`](./05-Agent-Specifications.md)

---

## Research Report Structure

Every research report follows this structure:

1. **Executive Summary**
2. **Research Objective**
3. **Key Findings**
4. **Evidence**
5. **Expert Consensus**
6. **Conflicting Evidence**
7. **Confidence Assessment**
8. **Important Unknowns**
9. **Recommended Next Steps**
10. **References**

Section order is a product transparency contract. Operational assembly details live with reporting architecture (`packages/reporting` and [`04-Research-Pipeline.md`](./04-Research-Pipeline.md)).

---

## Promise

Every conclusion should be:

- Evidence-backed
- Transparent
- Verifiable
- Actionable
- Honest about uncertainty

---

## Non-Goals

The platform is **not**:

- A generic chatbot that invents fluent answers
- A ranked search index optimized only for click-through
- An authority that replaces the user's judgment
- A system that hides conflict, uncertainty, or weak evidence

---

## Governance Hierarchy

Documents are authoritative in this order:

1. **Master Vision** (`00-Master-Vision.md`) — this document
2. **Founder Brief** (`01-Founder-Brief.md`)
3. **Constitution** (`02-Constitution.md`)

Subsequent architecture and engineering documents (`03` onward) must align with all three, in that order of authority. Most of those documents are **versioned** (pipeline, runtime, agents, packages, APIs) — they evolve without amending this vision's principles.

---

## Naming Guidance

"Forge Search Engine" / "FSE" is a working identity. Prefer purpose-based names for packages and namespaces (`search`, `verification`, `reasoning`, `reporting`, `memory`, `workspace`, `core`, `shared`, `types`). Isolate branding to top-level surfaces (README, app metadata) so a future rename remains inexpensive.

Package boundaries are **versioned** (see `03` / `packages/`); do not treat the current set as constitutional.


---

## Changelog

- **2026-07-29** — Appended Changelog section to comply with stable-document edit rule introduced in `10-Architectural-Principles.md` (no substantive content change).
