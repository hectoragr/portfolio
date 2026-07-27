# Playbook: Commit audit

**Run this on every commit, without exception.** It is the mechanism that keeps `AGENTS.md` from going
stale. Skipping it is how a knowledge base rots.

---

## The sequence

```bash
# 1. Gate — typecheck + tests + build, must exit 0
npm run verify

# 2. Review exactly what you are about to ship
git status
git diff --stat
git diff                     # actually read it

# 3. AUDIT — see below. Update AGENTS.md in this same commit if needed.

# 4. Commit
git add -A
git commit
```

CI runs the same three steps as `npm run verify`, so a green local run means a green pipeline. Nothing
here runs automatically, though — there are no git hooks. And CI still cannot catch content mistakes,
bad translations, or anything visual, so look at the page before you push.

---

## Step 4: the four audit questions

Answer all four out loud before writing the commit message. Any "yes" means you edit `AGENTS.md` or a
playbook **in this same commit**.

### 1. Correct — was anything documented wrong or stale?

Triggers:
- A documented command errored, or printed something different from what `AGENTS.md` §4 claims.
- A file path, port, count, or version in the docs didn't match reality.
- A "Known issue" description no longer matches the actual failure.

Action: fix the text and, where it's a factual claim, re-run the command and paste the real numbers.

### 2. Augment — did you learn something a future agent can't get from the code?

Triggers:
- You had to read three files to figure out one rule (e.g. "both language blocks must stay parallel").
- An error message was cryptic and the real cause was somewhere else.
- A tool behaved surprisingly (e.g. npm silently rewriting a lockfile you did not touch).
- You made a judgement call someone will otherwise re-litigate.

Action: add it to the right section — a rule to §3, a command quirk to §4, a data rule to §6, a
recurring procedure to a new `docs/workflows/` file **plus a row in the §11 index**.

Do **not** record things the code already says. "`Sidebar.tsx` renders nav items from an array" is
readable in five seconds; "the Spanish company names deliberately fall through to `default-company`"
is not.

### 3. Improve — where did the docs cause friction?

Triggers:
- You followed a playbook and had to improvise a missing step.
- Something was documented but buried where you didn't look.
- An instruction was ambiguous enough that you had to guess.

Action: rewrite for the next reader. Move it to where you *looked first*, not where it logically belongs.

### 4. Retire — is anything now obsolete?

Triggers:
- You fixed a "Known issue" → **delete the numbered entry** (don't strike it through) and update any
  section that referenced it, including the pre-commit gate in §4 and §12.
- A playbook describes a flow that no longer exists → delete the file and its index row.
- A workaround is no longer needed → remove it so nobody keeps performing it.

Stale-but-harmless entries are worse than missing ones: they teach agents to distrust the file.

---

## Step 4b: append to the ledger

Add one row to the **Knowledge ledger** table at the bottom of `AGENTS.md`:

```markdown
| 2026-08-14 | a1b2c3d | Enabled Terraform remote state; retired Known issue #2 and the "state is local" warnings in §10 and infra-terraform.md. |
```

Use the actual date and the short SHA (add it in a follow-up amend, or write `*(this commit)*`).
**An audit that changed nothing still gets no row** — the ledger tracks knowledge changes, not commits.

---

## Step 4c: if you edited any docs, check the links

Cross-references between `AGENTS.md` and the playbooks are the first thing to rot. This must print
`broken: 0`:

```bash
python3 - <<'PY'
import re, os
bad = 0
files = ['AGENTS.md','CLAUDE.md','GEMINI.md','QWEN.md','.kiro/steering/agents.md'] \
        + sorted('docs/workflows/'+x for x in os.listdir('docs/workflows'))
for f in files:
    src = open(f).read()
    base = os.path.dirname(f)
    anchors = {re.sub(r'[^a-z0-9 -]','',h.lower()).replace(' ','-')
               for h in re.findall(r'^#+\s+(.+)$', src, re.M)}
    for m in re.finditer(r'\]\((?!https?:)([^)#]+)(#[^)]*)?\)', src):
        if not os.path.exists(os.path.normpath(os.path.join(base, m.group(1)))):
            print(f'BROKEN FILE   {f} -> {m.group(1)}'); bad += 1
    for m in re.finditer(r'\]\(#([a-z0-9-]+)\)', src):
        if m.group(1) not in anchors:
            print(f'BROKEN ANCHOR {f} -> #{m.group(1)}'); bad += 1
print('files:', len(files), '| broken:', bad)
PY
```

Note that `AGENTS.md` section anchors include their number (`#13-known-issues`). **Renumbering a
section breaks every link to it** — re-run this check after any renumbering.

---

## Commit message

```
<type>: <imperative summary, lowercase, no trailing period>

- <what changed and why, one bullet per meaningful change>
- <include doc updates explicitly: "AGENTS.md: retire known issue #3">
```

Types in use: `feat:`, `fix:`, `docs:`, `chore:`.
Add a `Co-Authored-By:` trailer when an agent wrote the change.

---

## Before pushing to `master`

`master` deploys to production with no approval gate. Confirm:

- [ ] `npm run verify` passed (13 tests as of the last audit — a lower count means you deleted tests)
- [ ] `git status` is clean apart from your intended changes
- [ ] Both `en` and `es` updated if you touched any user-visible string
- [ ] `AGENTS.md` audited, and its ledger updated if anything changed
- [ ] If you added a route: `public/sitemap.xml` updated

Then `git push`, and follow [`deploy-and-rollback.md`](./deploy-and-rollback.md) to verify it landed.
