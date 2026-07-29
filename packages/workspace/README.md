# `packages/workspace`

## Owns

**Project workspaces and user research context:**

- Projects and folders
- Saved research collections
- Collaboration primitives (when introduced)
- User/context scoping for research sessions

## Does not own

- Knowledge persistence engine (`memory`)
- Report assembly (`reporting`)
- External source retrieval (`search`)
- Verification or reasoning
- Pipeline orchestration (`orchestration`)

## Logical pipeline stage(s)

None as primary owner. Supports:

- Intent Analysis (user/project context)
- Knowledge Storage (scope identifiers — see OPEN-3)

## Status

Scaffold only — no application code yet.
