# Packages

Purpose-based shared libraries for the monorepo. Package names deliberately avoid brand-scoped prefixes (e.g. no `@fse/*`) so a future product rename stays inexpensive.

| Package | Responsibility |
|---|---|
| [`core`](./core) | Shared business logic and domain models |
| [`shared`](./shared) | Cross-cutting utilities with no domain knowledge |
| [`types`](./types) | TypeScript type/interface definitions only |
| [`search`](./search) | Web and source-discovery logic |
| [`ai`](./ai) | Model/agent orchestration and prompting logic |
| [`reporting`](./reporting) | Research report assembly and formatting |

## Open Question — Verification Boundary

Evidence verification, consensus detection, and conflict analysis are core product capabilities (Master Vision pipeline stages 6–8).

**Unresolved:** Should that logic live in `packages/ai`, or in a future dedicated package such as `packages/verification`?

Do not resolve silently during scaffolding. Capture the decision in `docs/03-System-Architecture.md` when criteria are clear.
