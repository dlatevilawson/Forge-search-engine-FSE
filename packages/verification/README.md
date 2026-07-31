# `packages/verification`

## Owns

**Claim validation only** — evaluating whether claims are supported by sources and assessing source/claim reliability at the verification boundary.

Public façade: **`verifyEvidence(candidates, { query })` → `VerificationOutcome`**.

Internally (not exported):

1. **Deterministic credibility scoring** — domain tier, publication-date presence, HTTPS
2. **LLM claim-consistency check** (`OPENAI_API_KEY`) — does title+snippet relate to the query?

## Does not own

- Retrieval / source discovery (`search`)
- Consensus, conflict analysis, or confidence assessment (`reasoning`)
- Report assembly (`reporting`)
- Persistence (`memory`) or workspaces (`workspace`)
- Retry / recovery for LLM failures (`orchestration`)

## Environment

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | Required for claim-consistency LLM step |

## Logical pipeline stage(s)

- Evidence Verification

## Notes

Credibility scoring that also feeds confidence may sit on the verification↔reasoning boundary — see **OPEN-2** in `docs/04b-Traceability-Matrix.md`. Do not silently place it. `scoreCredibility` remains private behind the façade.

## Status

Real first-pass verification (credibility + consistency). No cross-source consensus/conflict (Reasoning). No general fact-checking.
