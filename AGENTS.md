# AGENTS.md

Single source of truth for any AI coding agent working in this repository.
`CLAUDE.md`, `GEMINI.md`, and `QWEN.md` are thin pointers to this file — **edit this file, never the pointers.**

> **Scope of trust:** every command, path, number, and behaviour in this document was executed and verified
> on the date shown in the [Knowledge ledger](#knowledge-ledger). Anything unverified is explicitly marked
> `UNVERIFIED`. If you find a discrepancy, fix it here as part of your commit — see [Commit protocol](#12-commit-protocol).

---

## 1. What this is

The personal portfolio site of Héctor A. Gómez Reyes — a static single-page React app served from
S3 + CloudFront at **https://hectoragomez.com**.

| Fact | Value |
|---|---|
| GitHub repo | `hectoragr/portfolio` (**private**) |
| Default branch | `master` |
| Live URL | https://hectoragomez.com (+ `www.` alias) |
| Hosting | AWS S3 (origin) + CloudFront (CDN) + Route 53 (DNS) + ACM (TLS) |
| Deploy trigger | push to `master` → GitHub Actions |
| License | GPL-3.0 |
| Package manager | **npm** (`package-lock.json` v3 is authoritative) |

There is **no backend and no runtime environment**. Everything ships as static files.
The "AI Chat" nav entry is an outbound link to `https://chat.hectoragomez.com`, which is a *separate
system not hosted in this repo* — do not look for its code here.

---

## 2. Agent compatibility — how each tool loads this file

This repo is wired so the same knowledge reaches every agent without duplication.

| Tool | Reads | Setup needed |
|---|---|---|
| **Claude Code** (CLI / desktop / web / IDE ext.) | `CLAUDE.md` → points here | None. Auto-loaded at session start. |
| **Kiro — IDE** | Root `AGENTS.md` + `.kiro/steering/agents.md` | None. Both are always-included. |
| **Kiro — CLI** | Root `AGENTS.md` + `.kiro/steering/agents.md` | None for normal chat. **Custom agents do not auto-load steering** — add `"resources": ["file://AGENTS.md", "file://.kiro/steering/**/*.md"]` to the agent config. |
| **Gemini CLI** | `GEMINI.md` → points here | None. To read `AGENTS.md` directly instead, set `"contextFileName": "AGENTS.md"` in `.gemini/settings.json`. |
| **Qwen Code / local models** (qwen, Ollama-backed) | `QWEN.md` → points here | None. Recent Qwen Code includes `AGENTS.md` in its default context search; older builds need `"contextFileName": "AGENTS.md"` in `.qwen/settings.json`. |
| **Cursor / Windsurf / Cline / opencode / aider** | Root `AGENTS.md` | Most read `AGENTS.md` natively. For aider: `--read AGENTS.md`. |

**Filenames are case-sensitive to these tools.** They must stay exactly `AGENTS.md`, `CLAUDE.md`,
`GEMINI.md`, `QWEN.md` — all-caps stem, lowercase `.md`. Do not rename to `Agents.md`.

**Kiro steering:** `.kiro/steering/agents.md` carries `inclusion: always` front-matter and points at
this file. It exists mainly for **custom agents**, which do not auto-load root `AGENTS.md`. It restates
only the handful of guardrails that cause production incidents; everything else stays here. Kiro also
reads `~/.kiro/steering/*.md` globally — nothing in this repo depends on that.

**Every pointer file is a pointer.** `CLAUDE.md`, `GEMINI.md`, `QWEN.md`, and
`.kiro/steering/agents.md` must never accumulate knowledge of their own. New knowledge goes here.

**For small/local models:** sections 4 (Commands), 6 (Data contracts), and 11 (Playbooks) are the
load-bearing ones. If context is tight, load section 4 + the single relevant playbook from
`docs/workflows/` and skip the rest.

---

## 3. Golden rules

1. **Verify before you claim.** Run the command; paste the real output. Never report a build or test
   as passing without having run it.
2. **`npm run verify` before every commit.** Typecheck + tests + build. CI runs the same three steps,
   so green locally means green in the pipeline.
3. **Bilingual or it's broken.** Every user-visible string exists in both `en` and `es`. Editing one
   language without the other is a bug, not a partial change.
4. **Never hand-edit `build/`.** It is generated and gitignored.
5. **Never commit `infrastructure/terraform.tfstate*` or `*.tfvars`.**
6. **Small, single-purpose commits.** One feature or fix per commit; push to `master` deploys to
   production immediately.
7. **Run the [commit audit](#12-commit-protocol) before every commit.** This file must never go stale.

---

## 4. Commands

All commands run from the repo root. Timings measured on Linux, Node 22.22.0, npm 10.9.4.

| Command | What it does | Verified result |
|---|---|---|
| `npm ci` | Clean install, exactly matches CI | ✅ **~2 min cold** |
| `npm start` | Vite dev server + HMR | ✅ **http://localhost:5173** — *not* 3000 |
| `npm run build` | Production bundle → `build/` | ✅ 84 modules, **~2.5 s** |
| `npm test` | Vitest, single run | ✅ **4 files / 17 tests**, ~2.3 s |
| `npm run test:watch` | Vitest watch mode | ✅ |
| `npm run typecheck` | `tsc --noEmit` | ✅ clean |
| `npm run preview` | Serve the built `build/` locally | ✅ |
| **`npm run verify`** | **typecheck + test + build** | ✅ **the pre-commit gate** |

### Pre-commit gate (deterministic, copy-paste)

```bash
npm run verify
```

One command, must exit 0. **CI runs exactly these three steps in the same order**, so a green local
`verify` means a green pipeline.

### Build output (verified)

```
build/index.html                   2.90 kB │ gzip:   1.04 kB
build/assets/index-<hash>.css    237.87 kB │ gzip:  32.36 kB   ← ~90% is Bootstrap
build/assets/index-<hash>.js     310.67 kB │ gzip: 100.46 kB
build/{favicon.ico, manifest.json, robots.txt, sitemap.xml, img/, assets/profile.jpg}
```

Output dir is **`build/`**, not Vite's default `dist/` (set in `vite.config.ts`) — the deploy workflow
depends on this. Don't "fix" it.

### Expected output

A clean run emits **no warnings**. The Sass and Vite CJS deprecation warnings that used to appear were
fixed (`sass:color` module, `api: 'modern-compiler'`, `"type": "module"`). **If a deprecation warning
reappears, treat it as a regression**, not as background noise.

### Command gotchas

**Node version is pinned in `.nvmrc` (22).** CI reads the same file via `node-version-file`, so local
and CI cannot drift. If you bump it, bump `.nvmrc` only.

**`--legacy-peer-deps` is no longer used or needed.** Verified: a clean `npm ci` resolves without it.
It dated from the React 19 upgrade (commit `76f7ad3`) and was dropped once the dependency tree caught
up. Don't reintroduce it to paper over a conflict — fix the conflict.

**There is no `yarn.lock`.** It was removed and is gitignored: npm used to rewrite it on every install
(even `--dry-run`), producing a ~660-line phantom diff. If one reappears, delete it.

**Cross-platform.** All scripts are plain `vite`/`vitest`/`tsc` invocations with no shell built-ins, so
they work identically on Linux, macOS, and Windows (PowerShell or cmd). `cross-env` is already a
dependency if you ever need to set env vars in a script.

**Agent tool constraints.** Long-running commands (e.g., `npm ci` on cold cache) may time out or have
their output truncated in AI IDE terminals. Prefer `npm run build` (fast, ~2.5 s) for verification over
`npm ci` when packages are already installed. When terminal output is truncated, the command still
ran — check the exit code, not the output completeness.

---

## 5. Architecture

### Runtime flow

```
index.html            (repo root — Vite entry, all static SEO meta + JSON-LD)
  └─ /src/index.js    createRoot → <App/>, then serviceWorker.unregister()
       └─ App.tsx
            └─ HelmetProvider           react-helmet-async: per-page <head>
                 └─ BrowserRouter
                      └─ AppShell       hamburger + sidebar + <main>
                           └─ Routes
                                /        → HomePage
                                /resume  → Resume
                                /faq     → FAQ        (labelled "Socials" in the UI)
                                *        → FourOhFour
```

### File map

| Path | Role |
|---|---|
| `index.html` | **Real** Vite entry. Static `<title>`, SEO meta, OG/Twitter cards, Person JSON-LD. |
| `public/` | Copied verbatim to `build/`. Contains `favicon.ico`, `manifest.json`, `robots.txt`, `sitemap.xml`, `img/`, `assets/profile.jpg`. |
| `.nvmrc` | Node version (22). Read by CI via `node-version-file` — the single source of truth. |
| `src/index.js` | Bootstrap: React root, plus a one-off cleanup that unregisters any legacy CRA service worker. JSX in a `.js` file — handled by the custom Vite plugin. |
| `src/App.tsx` | Providers + routes. Imports Bootstrap CSS globally. |
| `src/commons/AppShell.tsx` | Two-column shell; mobile drawer state (`sidebarOpen`) + overlay. |
| `src/commons/Sidebar.tsx` | Photo, name/title, socials, `navItems` array, AI-Chat external link, EN/ES toggle. |
| `src/config/personal.ts` | `PERSONAL` const: name, title, location, email, linkedin, github, photo. |
| `src/commons/work-experience.json` | **All** resume content, both languages. See §6. |
| `src/commons/skills.json` | Skills grid content. See §6. |
| `src/i18n/{index.ts,en.json,es.json}` | i18next setup + UI strings (32 keys each). |
| `src/styles/_variables.scss` | The 8 design tokens. |
| `src/HomePage/`, `src/Resume/`, `src/FAQ/`, `src/404.tsx` | Pages, each with a co-located `.scss`. |
| `src/test/setup.ts` | Loads `@testing-library/jest-dom`. Wired via `vite.config.ts`. |
| `.github/workflows/deploy.yml` | The entire CI/CD pipeline. See §9. |
| `infrastructure/*.tf` | Terraform for all AWS resources. See §10. |
| `docs/workflows/` | Reusable playbooks. See §11. |
| `docs/superpowers/` | Historical design spec + plan from the 2026-05-31 redesign. Reference only. |
| `.kiro/steering/agents.md` | Kiro steering pointer. See §2. |

### Key conventions

- **Language selection:** `i18n.language === 'es' ? 'es' : 'en'` — the JSON files are keyed by language
  at the *top* level, so components index into `data[lang]`. Persisted to `localStorage['i18nextLng']`.
- **Vite JSX-in-.js plugin:** `vite.config.ts` runs `transformWithEsbuild` over `src/**/*.js` so
  `src/index.js` can contain JSX. Prefer `.tsx` for anything new.
- **`tsconfig.json` covers `src` only.** `vite.config.ts` is not typechecked, which is why its
  Vitest `test` block doesn't error. Vitest globals are declared via
  `"types": ["vitest/globals", "@testing-library/jest-dom"]`, which is what makes `npm run typecheck`
  pass over the test files.
- **`"type": "module"`** in `package.json` — set so Vite loads its config as ESM. Any new `.js` file
  in the repo root is therefore an ES module; use `.cjs` if you ever need CommonJS.
- **No linter is configured.** No ESLint, no Prettier. Match surrounding style by hand.

### Styling

- Tokens in `src/styles/_variables.scss` — **the only place colors are defined**:
  `$navy-deep #1a1a2e`, `$navy-mid #16213e`, `$navy-light #0f3460`, `$navy-border #1a3a6e`,
  `$accent-red #e94560`, `$text-primary #ccd6f6`, `$text-muted #8892b0`, `$text-dim #6b7db3`.
- Every component SCSS starts with `@use '../styles/variables' as *;` (modern Sass module syntax —
  do not use `@import`).
- **BEM naming**: `.sidebar__nav-item--active`, `.home-section__title`, `.timeline-item__dot`.
- **No inline styles** in new code (a few legacy ones remain in `src/404.tsx`).
- Bootstrap 5 is imported globally for grid/utilities only; layout is custom flexbox.
- Mobile breakpoint is **767px** (sidebar becomes an off-canvas drawer).

### Testing

- Vitest + React Testing Library, `jsdom`, globals enabled (`describe`/`it`/`expect`/`vi` need no import).
- Tests are co-located: `Sidebar.tsx` → `Sidebar.test.tsx`.
- **Established pattern — mock `react-i18next`** so tests assert on English fallbacks:
  ```tsx
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string, fallback?: string) => fallback ?? key,
      i18n: { changeLanguage: vi.fn(), language: 'en' },
    }),
  }));
  ```
- Components using `<NavLink>`/`<Link>` must be wrapped in `<MemoryRouter>`.
- Mock the JSON data modules (`vi.mock('../commons/work-experience.json', ...)`) so content edits don't
  break tests.

---

## 6. Content data contracts

Editing content = editing JSON. These schemas are load-bearing; breaking them breaks the render.

### `src/commons/work-experience.json`

Top level is `{ "es": {...}, "en": {...} }`. **Both language blocks must stay structurally identical** —
same number of jobs, same order — because `HomePage` and `Resume` index by position.

```jsonc
{
  "en": {
    "jobs": [                       // newest first; HomePage marks index 0 as the active timeline dot
      {
        "title":       "string",
        "company":     "string",    // exact match drives the brand color class — see below
        "location":    "string",
        "startDate":   "YYYY-MM-DD",
        "endDate":     "YYYY-MM-DD" | null,   // null renders as "Present"
        "description": "string",
        "bullets":     ["string"],
        "skills":      ["string"]
      }
    ],
    "education": [
      { "degree", "institution", "location", "startDate", "endDate", "description" }
    ],
    "other": {
      "description": "string",
      "hobbies":   ["string"],
      "languages": [{ "name": "string", "level": "string" }],
      "interests": ["string"]
    }
  },
  "es": { /* identical shape, Spanish values */ }
}
```

**Date rules:** `startDate`/`endDate` are parsed with `new Date(...)`. A **future** `endDate` renders as
"Present"/"Presente" — that's intentional, not a bug. Use `null` for genuinely current roles.

**Company → CSS class mapping** is a hard-coded `switch` in `src/Resume/Resume.tsx`:

| `company` value (exact string) | class |
|---|---|
| `Amazon Web Services` | `amazon-span` |
| `Amazon Leo (through INSPYR Solutions)` | `amazon-span` |
| `Amazon Leo (a través de INSPYR Solutions)` | `amazon-span` |
| `Oracle America Inc.` | `oracle-span` |
| `Intel Corporation` | `intel-span` |
| anything else | `default-company` |

Same pattern for `institution` → `itesm-span` / `udemy-span` / `default-institution`.
**The Spanish block uses translated company names**, so they fall through to `default-company` by
design. If you want a brand color in Spanish too, add the Spanish string to the `switch`.

### `src/commons/skills.json`

```jsonc
{ "categories": [ { "name": "Frontend", "nameEs": "Frontend", "skills": ["React", "..."] } ] }
```

Unlike work-experience, this is a **single list** with per-item `name`/`nameEs`.
Current categories: Frontend, Backend, AI, Cloud & Infra, Tools. Max 7 skills per category.

### `src/i18n/{en,es}.json`

33 keys each, grouped under `welcome`, `homepage`, `home`, `nav`, `resume`, `404`.
Components call `t('key.path', 'English fallback')` — the fallback is what tests assert on, so keep it
accurate. Both files must have **identical key sets**.

---

## 7. SEO surfaces

A content change often touches more than one of these. Check all four:

1. `index.html` — static `<title>`, description, keywords, OG/Twitter, canonical, Person JSON-LD
   (`knowsAbout`, `alumniOf`, `worksFor`).
2. Per-page `<Helmet>` blocks in `HomePage.tsx`, `Resume.tsx`, `FAQ.tsx`.
3. `public/sitemap.xml` — currently lists `/`, `/resume`, `/faq`. **A new route must be added here.**
4. `public/robots.txt` — allow-all + sitemap pointer.

⚠️ `public/*` files are **not content-hashed** but are uploaded with `max-age=31536000, immutable`
(see §9). CloudFront invalidation clears the edge, but returning visitors' browsers keep the old
`sitemap.xml` / `robots.txt` / `favicon.ico` / `og-preview.png` for up to a year.

---

## 8. Local dev

```bash
npm ci        # once, ~2 min
npm start     # http://localhost:5173
```

There are **no environment variables and no `.env` files**. Nothing to configure.
Node version comes from `.nvmrc` (22) — `nvm use` picks it up, and CI reads the same file, so local
and CI cannot drift.

---

## 9. Deploy pipeline — `.github/workflows/deploy.yml`

**Trigger:** every push to `master`. There is no manual approval and no staging environment.
**Push to `master` = production release.**

| Step | Detail |
|---|---|
| 1. Checkout | `actions/checkout@v4` |
| 2. Node | `actions/setup-node@v4`, `node-version-file: .nvmrc`, `cache: npm` |
| 3. Install | `npm ci` |
| 4. Typecheck | `npm run typecheck` |
| 5. Test | `npm test` |
| 6. Build | `npm run build` |
| 7. Auth | `aws-actions/configure-aws-credentials@v4` via **OIDC** — no static keys |
| 8. Sync | `aws s3 sync build/ s3://hectoragomez.com --delete --exclude index.html --cache-control "max-age=31536000,public,immutable"` |
| 9. Shell | `aws s3 cp build/index.html s3://hectoragomez.com/index.html --cache-control "no-cache,no-store,must-revalidate"` |
| 10. Invalidate | `aws cloudfront create-invalidation --paths "/*"` |

Steps 4–6 are exactly what `npm run verify` runs locally, in the same order. A failure in any of them
aborts before anything reaches S3.

**Permissions:** `id-token: write`, `contents: read`.
**Region:** `us-east-1`. **Bucket:** `hectoragomez.com`.

**Repository secrets** (verified present):

| Secret | Used for |
|---|---|
| `AWS_ROLE_ARN` | Role to assume via OIDC |
| `CLOUDFRONT_DISTRIBUTION_ID` | Cache invalidation target |

Both come from `terraform output` (`github_actions_role_arn`, `cloudfront_distribution_id`).

### The gate is real, but push is still the release

CI typechecks and tests before it builds, so a red suite can no longer reach production. What it
**cannot** catch: content mistakes (the tests mock the JSON data), broken translations, and anything
visual. There is no staging environment — `master` goes straight to the live domain. Run
`npm run verify` and look at the page in a browser before you push.

### Cache strategy, stated plainly

- Hashed assets (`assets/index-<hash>.{js,css}`) → immutable for 1 year. Correct.
- `index.html` → `no-cache`. Correct.
- **Everything else in `public/`** → also immutable for 1 year, but *not* hashed. This is the sharp edge
  described in §7.

### Verify a deploy

```bash
gh run list --limit 5
gh run watch                                   # live
curl -sI https://hectoragomez.com | head -20   # expect 200 + cloudfront headers
curl -s https://hectoragomez.com | grep -o '<title>[^<]*</title>'
```

Full procedure incl. rollback: `docs/workflows/deploy-and-rollback.md`.

---

## 10. Infrastructure — `infrastructure/*.tf`

Terraform `>= 1.5`, AWS provider `~> 5.0`. Two providers: default (`var.aws_region`) and an alias
`aws.us_east_1` because **CloudFront requires its ACM certificate in us-east-1**.

| File | Resources |
|---|---|
| `main.tf` | Terraform + provider config. **Backend is local** — the S3 backend block is commented out and the state bucket `hectoragomez-terraform-state` has not been created. |
| `variables.tf` | `domain_name` = `hectoragomez.com`, `aws_region` = `us-east-1`, `github_repo` = `hectoragr/portfolio` |
| `s3.tf` | Bucket (named after the domain), full public-access block, versioning on, bucket policy granting `cloudfront.amazonaws.com` `s3:GetObject` scoped by `AWS:SourceArn` |
| `cloudfront.tf` | OAC (sigv4), distribution with apex + `www` aliases, `PriceClass_100`, compression, TLS 1.2_2021, `default_ttl` 1 day / `max_ttl` 1 year |
| `acm.tf` | DNS-validated cert (apex + `www`), Route 53 validation records, `create_before_destroy` |
| `route53.tf` | Hosted zone (**must be imported**, not created — see the comment in the file) + A-alias records for apex and `www` |
| `iam.tf` | GitHub OIDC provider + role `portfolio-github-actions-deploy`, trust scoped to `repo:hectoragr/portfolio:ref:refs/heads/master` only, policy = S3 CRUD + `cloudfront:CreateInvalidation` |
| `outputs.tf` | `s3_bucket_name`, `cloudfront_domain`, `cloudfront_distribution_id`, `github_actions_role_arn`, `acm_certificate_arn` |

### SPA routing depends on CloudFront

S3 returns 403/404 for `/resume` and `/faq` because no such objects exist. `cloudfront.tf` maps both
**403 and 404 → `/index.html` with HTTP 200**, letting React Router take over. If client-side routes
start 404-ing in production, that's the block to check.

**State is local and unbacked** — see [Known issues #2](#13-known-issues). Two timestamped state
backups were previously tracked in git; they were untracked on 2026-07-27 and
`infrastructure/terraform.tfstate*` now covers every variant in `.gitignore`. (For the record: those
files held resource IDs and ARNs but **no credentials or key material** — `private_key` was `null`
throughout — and the repo is private.)

Procedures: [`docs/workflows/infra-terraform.md`](docs/workflows/infra-terraform.md).

---

## 11. Playbook index

Reusable, verified procedures. **Load only the one you need** — they are standalone.

| Playbook | Load when the task is… |
|---|---|
| [`docs/workflows/add-work-experience.md`](docs/workflows/add-work-experience.md) | Adding/editing a job, education entry, hobbies, or skills |
| [`docs/workflows/add-i18n-string.md`](docs/workflows/add-i18n-string.md) | Adding or changing any user-visible string |
| [`docs/workflows/add-page-route.md`](docs/workflows/add-page-route.md) | Adding a new page, route, or sidebar nav entry |
| [`docs/workflows/deploy-and-rollback.md`](docs/workflows/deploy-and-rollback.md) | Shipping, watching a deploy, or reverting a bad release |
| [`docs/workflows/infra-terraform.md`](docs/workflows/infra-terraform.md) | Touching AWS: CloudFront, S3, DNS, certs, IAM |
| [`docs/workflows/commit-audit.md`](docs/workflows/commit-audit.md) | **Every commit.** The knowledge-audit ritual. |

### Tool index

| Tool | Used for | Check it's there |
|---|---|---|
| `npm` 10.9.4 / Node 22 | Everything JS | `node -v && npm -v` |
| `gh` | Workflow runs, secrets, PRs | `gh auth status` |
| `aws` CLI | Manual S3/CloudFront ops | `aws sts get-caller-identity` |
| `terraform` >= 1.5 | Infrastructure | `terraform -version` |
| `git` | VCS | — |

`gh` is authenticated as `hectoragr`. Prefer `gh` over raw `curl` against the GitHub API.

### Historical design docs

`docs/superpowers/specs/2026-05-31-portfolio-redesign-design.md` and
`docs/superpowers/plans/2026-05-31-portfolio-redesign.md` record the sidebar redesign
(vCard2-inspired, navy/red). Useful for *why* the layout is what it is. They describe completed work —
do not treat their checkboxes as a live TODO list.

---

## 12. Commit protocol

Runs on **every** commit. Full detail: [`docs/workflows/commit-audit.md`](docs/workflows/commit-audit.md).

```bash
npm run verify                # 1. gate — typecheck + test + build, must exit 0
git status                    # 2. confirm nothing unintended is staged
# 3. AUDIT: reconcile this file against what you just learned (see below)
git add -A && git commit
```

### Step 4 — the knowledge audit

Before writing the commit message, answer these four questions. If any answer is "yes", **update
`AGENTS.md` or the relevant playbook in the same commit**:

1. **Correct** — did anything in this file turn out to be wrong or stale?
2. **Augment** — did I learn a fact a future agent would need and can't get from the code?
3. **Improve** — did I hit friction a better-written instruction would have prevented?
4. **Retire** — is any documented issue now fixed, or any playbook now obsolete?

Then append a row to the [Knowledge ledger](#knowledge-ledger). An audit that changes nothing is a
valid outcome — but it must be a decision, not an omission.

### Commit message format

Conventional-commit prefix, imperative mood, bullet body for anything non-trivial:

```
feat: add AI Chat nav link and update work experience data

- Sidebar: external link to chat.hectoragomez.com, opens in new tab
- work-experience.json: add Amazon Leo role (en + es)
- Sidebar.test.tsx: assert href and target
```

Prefixes in use: `feat:`, `fix:`, plus bare descriptive subjects on older commits.
Co-authorship trailers (`Co-Authored-By: ...`) are used when an agent wrote the change.

### Branching

Direct pushes to `master` deploy to production. For anything non-trivial, branch and open a PR
(`gh pr create`); merges to `master` then deploy. Past feature work used the `portfolio-redesign` branch.

---

## 13. Known issues

Verified, open, and each with the fix. Fix them opportunistically; **delete the entry when you do** —
see [`commit-audit.md`](docs/workflows/commit-audit.md) step 4.

The eleven issues in the first version of this file were all closed on 2026-07-27. What remains:

1. **Four npm advisories that need a Vite 5 → 8 major upgrade.** `npm audit` reports 1 moderate + 3
   high. All of them are **dev-server-only** and do not affect the deployed static site:
   - `esbuild` / `vite` — dev server request forgery, path traversal in optimized-deps `.map`
     handling, `server.fs.deny` bypass on Windows, `launch-editor` NTLM disclosure on Windows.
   - `react-router` — CSRF bypass in **RSC mode**. This app is a client-only `BrowserRouter` SPA with
     no server components and no actions, so the vulnerable path is not reachable.

   `npm audit fix` (non-breaking) is already applied. Clearing the rest requires `vite@8`, which is a
   real migration — the custom JSX-in-`.js` plugin, `build.outDir`, and the Sass `api` option all need
   re-verification. Do it deliberately, not with `--force`.

2. **Terraform state is local and unbacked.** `main.tf` has the S3 backend commented out and the
   state bucket has never been created, so `terraform.tfstate` exists on exactly one machine with no
   locking. This is the largest remaining fragility in the project.
   **Fix:** the "Enabling remote state" section of
   [`infra-terraform.md`](docs/workflows/infra-terraform.md).

3. **`public/` files ship unhashed with a one-year immutable cache.** `sitemap.xml`, `robots.txt`,
   `favicon.ico`, and `img/og-preview.png` are uploaded with `max-age=31536000, immutable` (§9).
   CloudFront invalidation clears the edge, but returning visitors keep the old copy for up to a year.
   **Fix:** give `public/` its own `aws s3 sync` pass with a short `--cache-control`, or accept the lag
   and rename files when they change.

4. **`autoprefixer` is a dependency with no PostCSS config.** It is installed but never runs — there
   is no `postcss.config.*` in the repo. Either wire it up or remove the dependency.

5. **Unused i18n keys.** `welcome`, `homepage.title`, `resume.description`, `resume.technologies`,
   `resume.current`, and `404.home` are defined in both locale files but referenced by no component.
   Harmless; tidy them when you next touch `src/i18n/`.

---

## Knowledge ledger

Append one row per commit that changes what agents need to know. Newest last.

| Date | Commit | What changed in the knowledge base |
|---|---|---|
| 2026-07-26 | *(initial)* | Initial `AGENTS.md` + pointer files + 6 playbooks. All commands, build/test output, deploy pipeline, secrets, Terraform layout, and 11 known issues verified by execution against `aee8d0e`. |
| 2026-07-27 | *(this commit)* | All 11 original known issues closed. §4 rewritten around the new `npm run verify` gate; §9 pipeline now typechecks and tests before building; §8 and §5 updated for `.nvmrc` and `"type": "module"`; §2 documents `.kiro/steering/agents.md`. §13 replaced with 5 remaining issues, all newly verified. Deprecation warnings are now regressions, not noise. |
| 2026-07-27 | *(this commit)* | resume-linkedin-sync feature: Download/Print button, print CSS (single-page), skills refresh, work-experience typo fixes, Resume.test.tsx (4 tests). §4 test count → 4/17, agent timeout lesson added. §6 updated for Amazon Leo mapping, 33 i18n keys, max-7-skills rule. |
