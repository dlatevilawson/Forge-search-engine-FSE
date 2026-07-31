# `packages/search`

## Owns

**Retrieval only** — fetching information from external sources.

- **Web retrieval (implemented)** — Exa Search API (`EXA_API_KEY` required)
- YouTube / docs / papers — **not implemented** this pass (return typed `hard-error`)

Returns typed [`SearchOutcome`](../types/src/index.ts) / `SearchResult[]`. Does **not** retry.

## Does not own

- Search strategy / planning (`core` planners)
- Retry / failure recovery (`orchestration` — CLOSED-1)
- Claim validation, reasoning, reporting, persistence

## Environment

| Variable | Purpose |
|---|---|
| `EXA_API_KEY` | **Required** for production web retrieval (Exa) |
| `SEARCH_FORCE_FAILURE` | `no-usable-results` \| `transient-error` \| `hard-error` — force typed outcomes for orchestration tests |

## Malformed-hit policy

Exa can return HTTP 200 with individual results missing title (observed in sustained-burst audit). Those hits are **dropped**; empty snippets are kept as `""`. If nothing usable remains → `no-usable-results`.

## Logical pipeline stage(s)

- Evidence Collection

## Status

Web retrieval is real (Exa). DuckDuckGo HTML scrape retired from this package. Other source kinds remain unimplemented.
