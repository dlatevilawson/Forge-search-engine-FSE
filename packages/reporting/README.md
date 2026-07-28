# `packages/reporting`

## Owns

**Report generation and assembly only** — turning pipeline outputs into the structured research report.

Canonical section order:

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

## Does not own

- Long-term memory or knowledge graphs (`memory`)
- Projects, folders, collaboration (`workspace`)
- Retrieval (`search`)
- Claim validation (`verification`)
- Consensus / conflict / confidence computation (`reasoning`) — consumes their outputs only
- Persistence of stored reports as knowledge (`memory` / Persistence Layer)

## Logical pipeline stage(s)

- Report Generation

## Status

Scaffold only — no application code yet.
