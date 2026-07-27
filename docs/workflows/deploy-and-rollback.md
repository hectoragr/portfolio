# Playbook: Deploy, verify, and roll back

**Pushing to `master` deploys to production.** No approval step and no staging environment. CI
typechecks and tests before it builds, but it cannot catch content mistakes, bad translations, or
anything visual. Treat every push as a release.

Pipeline detail: `AGENTS.md` §9. Workflow file: `.github/workflows/deploy.yml`.

---

## Deploy

```bash
# 1. Gate locally — same three steps CI runs
npm run verify

# 2. Make sure nothing stray is staged
git status

# 3. Ship
git push origin master
```

For anything non-trivial, branch and PR instead:

```bash
git switch -c feat/my-change
git push -u origin feat/my-change
gh pr create --fill
gh pr merge --squash    # merging to master triggers the deploy
```

---

## Watch it

```bash
gh run list --limit 5
gh run watch                    # live progress
gh run view --log-failed        # only if it fails
```

A healthy run takes **~30 seconds**. Runs that take 20+ minutes have historically meant npm
registry trouble, not a code problem.

Pipeline stages, in order: checkout → Node from `.nvmrc` → `npm ci` → `npm run typecheck` →
`npm test` → `npm run build` → OIDC auth → `s3 sync` → `s3 cp index.html` → CloudFront invalidation.

---

## Verify it landed

```bash
curl -sI https://hectoragomez.com | head -20
curl -s  https://hectoragomez.com | grep -o '<title>[^<]*</title>'
curl -sI https://hectoragomez.com/resume | head -5      # SPA route → 200, not 404
curl -sI https://www.hectoragomez.com | head -5         # www alias
```

Expect `HTTP/2 200`, a `x-cache:` header from CloudFront, and `cache-control: no-cache,no-store,
must-revalidate` on `index.html`.

Then load the site and confirm: sidebar renders, `/resume` deep-links, EN/ES toggle works,
mobile drawer opens under 767px.

### If the invalidation looks slow

```bash
aws cloudfront list-invalidations --distribution-id "$(cd infrastructure && terraform output -raw cloudfront_distribution_id)"
```

Invalidations usually complete in under a minute. Note that hashed assets change filename every build,
so they never need invalidating — the invalidation exists for `index.html` and the unhashed `public/`
files.

---

## Roll back

### Option A — revert the commit (preferred)

Clean, auditable, and re-runs the whole pipeline.

```bash
git revert <bad-sha>
npm run verify
git push origin master
```

### Option B — redeploy a known-good commit

```bash
gh run list --limit 20                        # find the last green run + its SHA
git checkout <good-sha> -- .                  # or: git reset --hard <good-sha> on a branch
npm ci && npm run build
```

Then push. **Do not** hand-upload to S3 unless the GitHub Actions path is itself broken — a manual sync
puts the bucket out of step with `master` and the next push will silently overwrite it.

### Option C — emergency manual sync (last resort)

Requires local AWS credentials with S3 + CloudFront permissions.

```bash
aws s3 sync build/ s3://hectoragomez.com --delete \
  --exclude "index.html" --cache-control "max-age=31536000,public,immutable"
aws s3 cp build/index.html s3://hectoragomez.com/index.html \
  --cache-control "no-cache,no-store,must-revalidate"
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

Mirror the workflow's cache-control flags exactly. Afterwards, push a matching commit to `master` so
git and the bucket agree.

The S3 bucket has **versioning enabled**, so overwritten objects are recoverable via
`aws s3api list-object-versions --bucket hectoragomez.com`.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Build passes locally, fails in CI | Rare now that `.nvmrc` pins Node for both. Check the runner actually picked it up |
| `Could not assume role` | `AWS_ROLE_ARN` secret wrong, or the OIDC trust policy in `infrastructure/iam.tf` doesn't match `repo:hectoragr/portfolio:ref:refs/heads/master` — the role is scoped to `master` only, so pushes from other branches cannot deploy |
| `AccessDenied` on invalidation | `CLOUDFRONT_DISTRIBUTION_ID` secret wrong, or the IAM policy's resource ARN drifted |
| New route 404s in production | CloudFront cache — the 403/404 → `/index.html` mapping is already configured; invalidate `/*` |
| Old `robots.txt` / `sitemap.xml` / favicon persists | Those are unhashed but shipped `immutable, max-age=31536000`. Invalidation fixes the edge; **returning browsers stay stale for up to a year.** Rename the file or accept the lag |
| Deploy succeeded but the site is unchanged | Check you pushed to `master`; then hard-reload (`index.html` is `no-cache`, so this is usually a browser extension or proxy) |

Refresh the secrets from Terraform if they're wrong:

```bash
cd infrastructure && terraform output
gh secret set AWS_ROLE_ARN
gh secret set CLOUDFRONT_DISTRIBUTION_ID
```
