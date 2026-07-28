# `packages/verification`

## Owns

**Claim validation only** — evaluating whether claims are supported by sources and assessing source/claim reliability at the verification boundary.

## Does not own

- Retrieval / source discovery (`search`)
- Consensus, conflict analysis, or confidence assessment (`reasoning`)
- Report assembly (`reporting`)
- Persistence (`memory`) or workspaces (`workspace`)
- Search strategy / task planning (runtime Orchestrator / Task Planner)

## Logical pipeline stage(s)

- Evidence Verification

## Notes

Credibility scoring that also feeds confidence may sit on the verification↔reasoning boundary — see **OPEN-2** in `docs/04b-Traceability-Matrix.md`. Do not silently place it.

## Status

Scaffold only — no application code yet.
