# `packages/search`

## Owns

**Retrieval only** — actually fetching information from external sources.

- Web retrieval
- YouTube retrieval
- Documentation corpus retrieval
- Papers / similar source retrieval
- Normalization of raw results into evidence *candidates*

## Does not own

- **Search strategy** (what to search, order, priority) — that is Task Planner / Orchestrator runtime, not this package
- Claim validation (`verification`)
- Consensus, conflict, or confidence (`reasoning`)
- Report assembly (`reporting`)
- Persistence (`memory`) or projects (`workspace`)

## Logical pipeline stage(s)

- Evidence Collection

## Status

Scaffold only — no application code yet.
