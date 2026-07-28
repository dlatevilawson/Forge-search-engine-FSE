# System Architecture

**Document:** `03-System-Architecture.md`  
**Authority:** Subordinate to Master Vision → Founder Brief → Constitution

---

## Purpose

Define the high-level system architecture for the evidence-first research platform: major components, package boundaries, runtime surfaces, and how they collaborate to deliver transparent research.

## Audience

Founding engineers, architects, and contributors who need a shared mental model of the system before implementing features.

## Scope

In scope:

- Monorepo layout and package responsibilities
- Application surfaces (`apps/*`)
- Agent runtime placement
- Data and storage boundaries
- Cross-cutting concerns (types, shared utilities, configuration)
- Alignment with success metrics: Accuracy, Transparency, Trust, Understanding, Decision Quality

Out of scope (for now):

- Implementation details of individual agents
- Database schemas
- API contracts
- Concrete framework or vendor selections beyond architectural intent

## Status

**Placeholder** — Structure defined; implementation sections intentionally empty pending architecture design work.

## Table of Contents

1. [Architectural Goals](#architectural-goals)
2. [Monorepo Overview](#monorepo-overview)
3. [Package Boundaries](#package-boundaries)
4. [Application Surfaces](#application-surfaces)
5. [Agent Runtime](#agent-runtime)
6. [Data & Storage Boundaries](#data--storage-boundaries)
7. [Cross-Cutting Concerns](#cross-cutting-concerns)
8. [Open Architectural Questions](#open-architectural-questions)
9. [Evolution Principles](#evolution-principles)

---

## Architectural Goals

<!-- Empty — to be authored -->

## Monorepo Overview

<!-- Empty — to be authored -->

## Package Boundaries

<!-- Empty — to be authored -->

## Application Surfaces

<!-- Empty — to be authored -->

## Agent Runtime

<!-- Empty — to be authored -->

## Data & Storage Boundaries

<!-- Empty — to be authored -->

## Cross-Cutting Concerns

<!-- Empty — to be authored -->

## Open Architectural Questions

### Evidence verification, consensus, and conflict detection

**Open question:** Should evidence verification, consensus detection, and conflict analysis live in `packages/ai` (as agent orchestration concerns), or in a future dedicated package such as `packages/verification`?

This is intentionally unresolved at foundation stage. Criteria for later decision should include:

- Domain purity vs. orchestration coupling
- Reuse across agents and pipelines
- Testability independent of model providers
- Alignment with Transparency and Trust success metrics

Do not silently decide this while scaffolding.

## Evolution Principles

<!-- Empty — to be authored -->
