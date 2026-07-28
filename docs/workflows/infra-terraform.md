# Playbook: Terraform / AWS changes

Everything under `infrastructure/` manages live production DNS, TLS, and CDN for
**hectoragomez.com**. A careless `terraform apply` can take the site offline for hours (DNS and ACM
validation are slow to recover). Resource inventory: `AGENTS.md` §10.

---

## Before you touch anything

**State is local and unbacked.** `main.tf` has the S3 backend block commented out and the state bucket
`hectoragomez-terraform-state` has never been created. That means:

- `terraform.tfstate` exists only on one machine and is gitignored.
- **If you don't have that file, `terraform apply` will try to create resources that already exist**
  and fail with `AlreadyExists` — or worse, on `aws_route53_zone`, create a *duplicate* zone with
  different nameservers and break DNS.
- There is no locking. Never run apply from two places.

So: **run `terraform plan` first, always, and read every line.** If the plan proposes creating
resources you know exist, you are missing the state file. Stop and find it — do not apply.

---

## Standard change

```bash
cd infrastructure
terraform init          # first time, or after provider changes
terraform validate
terraform fmt -check    # -check first; run `terraform fmt` to fix
terraform plan -out=tfplan
```

Read the plan against this rule of thumb:

| Plan says | Verdict |
|---|---|
| `~ update in-place` on CloudFront behaviours / tags | Usually fine |
| `+ create` for something that already exists | **Stop — missing state** |
| `-/+ replace` on `aws_route53_zone` | **Stop — this changes nameservers and breaks DNS** |
| `-/+ replace` on `aws_acm_certificate` | Acceptable — `create_before_destroy` is set, but revalidation takes minutes |
| `-/+ replace` on `aws_cloudfront_distribution` | **Stop** — new distribution = new domain = the `AWS:SourceArn` bucket policy and the `CLOUDFRONT_DISTRIBUTION_ID` secret both break |
| Any change to `aws_s3_bucket.portfolio` deletion/versioning | **Stop** — that bucket holds the live site |

Then:

```bash
terraform apply tfplan
```

Applying a saved plan file (rather than a bare `terraform apply`) guarantees you ship exactly what you
reviewed.

---

## After applying

```bash
terraform output
```

If `github_actions_role_arn` or `cloudfront_distribution_id` changed, **update the GitHub secrets
immediately** or the next deploy fails:

```bash
gh secret set AWS_ROLE_ARN                  # paste github_actions_role_arn
gh secret set CLOUDFRONT_DISTRIBUTION_ID    # paste cloudfront_distribution_id
```

Then smoke-test production:

```bash
curl -sI https://hectoragomez.com | head -5
curl -sI https://hectoragomez.com/resume | head -5
curl -sI https://www.hectoragomez.com | head -5
```

---

## Never commit

```
infrastructure/terraform.tfstate
infrastructure/terraform.tfstate*.backup
infrastructure/*.tfvars
infrastructure/.terraform/
```

`.gitignore` covers all of these — `infrastructure/terraform.tfstate*` matches the plain state file,
`.backup`, and the timestamped `terraform.tfstate.<epoch>.backup` form alike. Two such backups were
tracked until 2026-07-27 and have been untracked. Still check `git status` after every Terraform run.

---

## Known quirks in this configuration

- **Two AWS providers.** The default uses `var.aws_region`; the `aws.us_east_1` alias exists because
  CloudFront requires its ACM certificate in us-east-1. `acm.tf` resources must keep
  `provider = aws.us_east_1`.
- **The Route 53 zone is an import, not a creation.** `route53.tf` documents it:
  ```bash
  aws route53 list-hosted-zones
  terraform import aws_route53_zone.portfolio <ZONE_ID>
  ```
  Applying without importing first creates a second zone with new nameservers — the registrar keeps
  pointing at the old one and the site goes dark.
- **The S3 bucket policy references the CloudFront distribution ARN** via `AWS:SourceArn`. Replacing
  the distribution invalidates that condition and S3 starts returning 403 for everything.
- **The GitHub OIDC role is scoped to `refs/heads/master` only.** Deploying from another branch
  requires widening the `StringLike` condition in `iam.tf` — think carefully before doing so.
- **`PriceClass_100`** limits edge locations to US/Canada/Europe. Visitors elsewhere see higher latency.
  That's a cost decision, not a bug.
- **OIDC thumbprint** is pinned in `iam.tf`. If GitHub rotates it, OIDC auth fails with a TLS error.
- **`monitoring.tf` adds the `hashicorp/archive` provider**, so `terraform init` must run again after
  pulling it — `validate`/`plan` fail with "missing or corrupted provider plugins" otherwise.
- **The SNS email subscription is not active until confirmed by hand.** After the first apply, AWS
  emails `var.alert_email` a "Confirm subscription" link. Until someone clicks it the subscription
  stays `PendingConfirmation` and **no alarm email is ever delivered** — the alarm still fires, it
  just fans out to nobody. Terraform cannot confirm it for you and will show the resource as created
  regardless, so this is silent. Check with:
  ```bash
  aws sns list-subscriptions-by-topic --topic-arn "$(terraform output -raw alerts_sns_topic_arn)"
  ```
  A real ARN in `SubscriptionArn` means confirmed; the literal string `PendingConfirmation` means not.

---

## Uptime monitoring (`monitoring.tf`)

A Synthetics canary loads https://hectoragomez.com/ in headless Chromium every 4 hours and requires
`#main-content` to render, so a 200 that serves a blank SPA still fails. A failed — or *missing* —
run trips `portfolio-uptime-alarm`, which emails `var.alert_email` through SNS, and emails again on
recovery.

**First apply, in order:**

1. `terraform init` (new `archive` provider), then the standard plan/apply above.
2. **Click the confirmation link** in the SNS email — see the quirk above. Nothing works until this.
3. Check the first run (the canary runs immediately on creation, then every 4 h):
   ```bash
   aws synthetics get-canary --name portfolio-uptime --query 'Canary.Status.State'   # RUNNING
   aws synthetics get-canary-runs --name portfolio-uptime \
     --query 'CanaryRuns[0].Status'                                                  # PASSED
   ```
4. Prove the email path end-to-end without touching the site:
   ```bash
   aws cloudwatch set-alarm-state --alarm-name portfolio-uptime-alarm \
     --state-value ALARM --state-reason "manual test"
   ```
   Expect a "down" email within a minute, then a recovery email once the next real datapoint lands.

**Failure triage.** Screenshots and HAR files for every run are in the
`hectoragomez-canary-artifacts` bucket (30-day expiry); logs are in CloudWatch under
`/aws/lambda/cwsyn-portfolio-uptime-*`. A canary failure with the site demonstrably up usually means
the selector moved — `#main-content` comes from `src/commons/AppShell.tsx`. **If you rename that id,
update `canary/canary.js.tftpl` in the same commit** or the canary starts crying wolf every 4 hours.

**Runtime versions expire.** AWS deprecates Synthetics runtimes on a schedule; a canary left on a
deprecated runtime eventually stops running (and `treat_missing_data = "breaching"` then pages you,
which is the intended failure mode). Check with `aws synthetics describe-runtime-versions` and bump
`runtime_version` in `monitoring.tf` — it is pinned deliberately, not left floating.

**Cost** is roughly $0.30/month: 180 canary runs at $0.0012 each, plus negligible S3 and SNS.

---

## Enabling remote state (recommended follow-up)

The single biggest fragility here. To fix:

```bash
aws s3 mb s3://hectoragomez-terraform-state --region us-east-1
aws s3api put-bucket-versioning --bucket hectoragomez-terraform-state \
  --versioning-configuration Status=Enabled
```

Then uncomment the `backend "s3"` block in `main.tf` and run `terraform init -migrate-state`.
When you do, **remove the "state is local" warnings from this file and from `AGENTS.md` §10**, and log
it in the Knowledge ledger — see [`commit-audit.md`](./commit-audit.md).

---

Finish with [`commit-audit.md`](./commit-audit.md).
