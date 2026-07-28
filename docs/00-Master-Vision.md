# Master Vision

**Status:** Constitutional — Root Source of Truth  
**Authority:** Highest. All other documents, and eventually all code, must be traceable back to this vision.  
**Identity note:** "Forge Search Engine" / "FSE" is the current working identity, not a confirmed permanent brand.

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

## Research Pipeline

Every research session follows this sequence:

1. **User Question** — capture the research request
2. **Intent Analysis** — clarify what the user needs to decide or understand
3. **Research Planning** — define scope, sources, and investigation strategy
4. **Research Delegation** — assign work to specialized agents
5. **Evidence Collection** — gather material from web, video, and other sources
6. **Evidence Verification** — evaluate quality, support, and reliability
7. **Consensus Analysis** — detect agreement across independent sources
8. **Conflict Detection** — surface and explain disagreements
9. **Confidence Assessment** — measure and explain confidence and unknowns
10. **Report Generation** — assemble a transparent research report
11. **Knowledge Storage** — persist findings for long-term use
12. **Future Updates** — refresh knowledge as evidence evolves

---

## Agent System

The platform operates through specialized agents. Each has a clear responsibility and must uphold the Agent Oath (see Constitution).

| Agent | Responsibility |
|---|---|
| Research Orchestrator | Plan, coordinate, and oversee the research session |
| Web Research Agent | Discover and collect web evidence |
| YouTube Research Agent | Extract and evaluate video-sourced claims |
| Documentation Agent | Gather and organize documentation sources |
| Evidence Verification Agent | Verify claims against sources and assess reliability |
| Consensus Engine | Detect and summarize agreement across sources |
| Conflict Analysis Agent | Identify, explain, and preserve conflicting evidence |
| Report Generation Agent | Assemble structured research reports |
| Knowledge Management Agent | Store, retrieve, and maintain long-term knowledge |

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

Subsequent architecture and engineering documents (`03` onward) must align with all three, in that order of authority.

---

## Naming Guidance

"Forge Search Engine" / "FSE" is a working identity. Prefer purpose-based names for packages and namespaces (`core`, `search`, `reporting`, etc.). Isolate branding to top-level surfaces (README, app metadata) so a future rename remains inexpensive.
