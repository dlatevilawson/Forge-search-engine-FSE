# AGENTS.md

## Cursor Cloud specific instructions

### Repository state

This repository is currently **documentation-only**. As of this writing it contains
no application source code, no dependency manifest (`package.json`,
`requirements.txt`, etc.), no build system, no automated tests, and no lint
configuration. The only content is markdown documentation plus a `LICENSE`:

- `README.md` — one-line project summary.
- `docs/00-Founder-Brief.md` — mission / vision / problem / solution.
- `docs/docs/01-Constitution.md` — working "constitution" document.

The `.gitignore` is standard Node.js boilerplate, signaling the project will
likely become a Node.js/TypeScript app, but nothing has been scaffolded yet.

### Consequences for setup / build / test / run

- There is **nothing to install, build, lint, test, or run** in the current state.
  Do not fabricate an application to "demonstrate" it works.
- The startup update script is intentionally a guarded no-op that only runs
  `npm install` if a `package.json` exists, so it stays safe until real code lands.

### When application code is added

Once the project is scaffolded, update this section and the startup update script
to reflect the real dependency install, lint, test, build, and run commands
(prefer referencing `package.json` scripts / Makefile targets rather than
duplicating them here).
