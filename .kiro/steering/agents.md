---
inclusion: always
---

# Project steering → AGENTS.md

**All project knowledge lives in [`AGENTS.md`](../../AGENTS.md) at the repository root. Read that file
before doing anything else in this repository.**

This steering file is a pointer — it holds no knowledge of its own and must never accumulate any. If
you learn something about this project, record it in `AGENTS.md`, not here. Kiro already loads root
`AGENTS.md` automatically in normal chat sessions; this file exists so that **custom agents**, which do
not auto-load steering, still get pointed at it via
`"resources": ["file://.kiro/steering/**/*.md"]`.

## Guardrails (the ones that cause production incidents)

- **`git push` to `master` is a production release.** No approval gate, no staging environment.
- **Run `npm run verify` before every commit** — typecheck + tests + build. CI runs the same three
  steps, so a green local run means a green pipeline.
- **Bilingual or it's broken.** Every user-visible string exists in both `src/i18n/en.json` and
  `es.json`, and `work-experience.json` keeps its `en` and `es` arrays parallel and in the same order.
- **Never commit `infrastructure/terraform.tfstate*` or `*.tfvars`.** Terraform state is local and
  unbacked — always `terraform plan` and read it before applying.
- **npm is the package manager.** There is no `yarn.lock`; it is gitignored on purpose.

## Where to look

- Commands, architecture, data contracts, deploy pipeline, infrastructure → `AGENTS.md`
- Step-by-step task recipes → `docs/workflows/` (indexed in `AGENTS.md` §11)
- The commit ritual, including the knowledge audit → `docs/workflows/commit-audit.md`
