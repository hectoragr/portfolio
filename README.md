# hectoragomez.com

Personal portfolio site of Héctor A. Gómez Reyes — a static React single-page app
deployed to AWS S3 + CloudFront.

**Live:** https://hectoragomez.com

---

## Stack

React 19 · TypeScript 5 · React Router 7 · react-i18next (EN/ES) · Bootstrap 5 · Sass
· Vite 5 · Vitest + React Testing Library · Terraform · GitHub Actions

## Quick start

Requires Node 22 (see `.nvmrc`).

```bash
npm ci        # install
npm start     # dev server → http://localhost:5173
```

## Scripts

| Script | Does |
|---|---|
| `npm start` | Vite dev server with HMR on port 5173 |
| `npm run build` | Production bundle into `build/` |
| `npm run preview` | Serve the built output locally |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | typecheck + test + build — run this before committing |

## Layout

```
index.html            Vite entry: static SEO meta + JSON-LD
src/
  index.js            React root
  App.tsx             Providers + routes
  commons/            AppShell, Sidebar, and the resume/skills JSON data
  HomePage/ Resume/ FAQ/   Pages, each with a co-located .scss
  i18n/               English + Spanish strings
  styles/             SCSS design tokens
  config/personal.ts  Name, links, photo
public/               Copied verbatim into build/ (favicon, sitemap, robots, images)
infrastructure/       Terraform: S3, CloudFront, Route 53, ACM, GitHub OIDC
.github/workflows/    Build, verify, and deploy on push to master
docs/workflows/       Task playbooks
```

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which typechecks, tests, builds,
syncs `build/` to S3, and invalidates CloudFront. AWS access uses GitHub OIDC — there are no
static credentials. **A push to `master` is a production release.**

## Contributing / working on this repo

All engineering knowledge — architecture, data contracts, deploy details, infrastructure,
and task playbooks — lives in **[`AGENTS.md`](./AGENTS.md)**. Read that first.

AI coding agents pick it up automatically: `CLAUDE.md`, `GEMINI.md`, `QWEN.md`, and
`.kiro/steering/` are thin pointers to the same file.

## License

GPL-3.0 — see [`LICENSE`](./LICENSE).
