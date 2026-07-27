# GEMINI.md

**All project knowledge lives in [`AGENTS.md`](./AGENTS.md). Read that file before doing anything else
in this repository.**

This file exists only so Gemini CLI auto-discovers the instructions. It is a pointer — it holds no
knowledge of its own and must never accumulate any. If you learn something about this project, record
it in `AGENTS.md`, not here.

To have Gemini CLI read `AGENTS.md` directly instead of this file, set in `.gemini/settings.json`:

```json
{ "contextFileName": "AGENTS.md" }
```

Quick orientation while you load it:

- Pre-commit gate: `npm run verify` — typecheck + tests + build. CI runs the same three steps.
- Dev server: `npm start` → http://localhost:5173
- Pushing to `master` deploys straight to production.
- Every commit requires the knowledge audit in [`docs/workflows/commit-audit.md`](./docs/workflows/commit-audit.md).
