# QWEN.md

**All project knowledge lives in [`AGENTS.md`](./AGENTS.md). Read that file before doing anything else
in this repository.**

This file exists only so Qwen Code (and other local-model CLIs derived from it) auto-discovers the
instructions. It is a pointer — it holds no knowledge of its own and must never accumulate any. If you
learn something about this project, record it in `AGENTS.md`, not here.

Recent Qwen Code builds already include `AGENTS.md` in the default context search. On older builds, set
in `.qwen/settings.json`:

```json
{ "contextFileName": "AGENTS.md" }
```

**Running on a small local model?** `AGENTS.md` is long. Load §4 (Commands) plus the single relevant
playbook from `docs/workflows/` and skip the rest — those sections are self-contained by design.

Quick orientation:

- Pre-commit gate: `npm run verify` — typecheck + tests + build. CI runs the same three steps.
- Dev server: `npm start` → http://localhost:5173
- Pushing to `master` deploys straight to production.
- Every commit requires the knowledge audit in [`docs/workflows/commit-audit.md`](./docs/workflows/commit-audit.md).
