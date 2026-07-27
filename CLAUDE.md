# CLAUDE.md

**All project knowledge lives in [`AGENTS.md`](./AGENTS.md). Read that file before doing anything else
in this repository.**

This file exists only so Claude Code auto-discovers the instructions. It is a pointer — it holds no
knowledge of its own and must never accumulate any. If you learn something about this project, record
it in `AGENTS.md`, not here.

Quick orientation while you load it:

- Pre-commit gate: `npm run verify` — typecheck + tests + build. CI runs the same three steps.
- Dev server: `npm start` → http://localhost:5173
- Pushing to `master` deploys straight to production.
- Every commit requires the knowledge audit in [`docs/workflows/commit-audit.md`](./docs/workflows/commit-audit.md).
