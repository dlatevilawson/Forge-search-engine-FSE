# `packages/search`

## Owns

**Retrieval only** — fetching information from external sources.

- **Web retrieval (implemented)** — DuckDuckGo HTML by default (no API key)
- YouTube / docs / papers — **not implemented** this pass (return typed `hard-error`)

Returns typed [`SearchOutcome`](../types/src/index.ts) / `SearchResult[]`. Does **not** retry.

## Does not own

- Search strategy / planning (`core` planners)
- Retry / failure recovery (`orchestration` — CLOSED-1)
- Claim validation, reasoning, reporting, persistence

## Environment

| Variable | Purpose |
|---|---|
| `SEARCH_FORCE_FAILURE` | `no-results` \| `transient-error` \| `hard-error` — force typed outcomes for orchestration tests |
| `BRAVE_API_KEY` | Reserved for optional Brave backend later; **not required** for DuckDuckGo path |

## Logical pipeline stage(s)

- Evidence Collection

## Status

Web retrieval is real. Other source kinds remain unimplemented.
