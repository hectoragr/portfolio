# Playbook: Add or edit resume content

Covers jobs, education, hobbies/languages/interests, and the skills grid.
All of it lives in two JSON files — **no component changes are needed** for ordinary content edits.

Read `AGENTS.md` §6 for the full schemas before editing.

---

## Where content renders

| You edit | Shows up on |
|---|---|
| `work-experience.json` → `jobs[]` | `/resume` (full: description, bullets, skills) **and** `/` (timeline: company, title, dates only) |
| `work-experience.json` → `education[]` | `/resume` only |
| `work-experience.json` → `other` | `/resume` only |
| `skills.json` → `categories[]` | `/` only (skills grid) |

---

## Add a job

Edit `src/commons/work-experience.json`. **Add the entry to both `en.jobs` and `es.jobs`, at the same
index.** `HomePage` marks `jobs[0]` as the active timeline dot, so newest goes first.

```jsonc
{
  "title":       "Senior Software Engineer",
  "company":     "Example Corp",
  "location":    "Seattle, WA (US)",
  "startDate":   "2026-08-01",
  "endDate":     null,                 // null → renders "Present" / "Presente"
  "description": "One-sentence summary of the role.",
  "bullets":     ["Achievement one", "Achievement two"],
  "skills":      ["TypeScript", "React", "AWS"]
}
```

Then the Spanish twin in `es.jobs[0]` — same keys, translated values, same position.

### Rules that bite

- **Parallel arrays.** `en` and `es` must have the same number of entries in the same order. The
  components index by position; a mismatch silently shows the wrong job in one language.
- **Dates are `YYYY-MM-DD` strings** parsed with `new Date()`. A *future* `endDate` renders as
  "Present" — that's deliberate. Use `null` for a genuinely current role.
- **Company brand colors are a hard-coded `switch`** in `src/Resume/Resume.tsx`. Only these exact
  strings get a color: `Amazon Web Services`, `Oracle America Inc.`, `Intel Corporation`. Everything
  else gets `default-company` — including the Spanish translations of those same companies, by design.
  Want a color for a new company? Add the case to `getCompanyClassName` **and** a matching class to
  `src/Resume/Resume.scss`.
- **Education institutions** work the same way via `getEducationClassName`: `Tecnológico de Monterrey`
  → `itesm-span`, `Udemy` → `udemy-span`.

---

## Add a skills category or skill

Edit `src/commons/skills.json`. Unlike work-experience this is a **single list** with per-item
translations:

```jsonc
{
  "categories": [
    { "name": "Frontend", "nameEs": "Frontend", "skills": ["React", "TypeScript"] }
  ]
}
```

Existing categories: Frontend, Backend, AI, Cloud & Infra, Tools.
The grid is CSS-driven and takes any number of categories.

---

## Also update (easy to forget)

A significant resume change usually means these too:

- `index.html` — the Person JSON-LD block: `worksFor`, `alumniOf`, `knowsAbout`.
- `index.html` + per-page `<Helmet>` — the meta descriptions name "Oracle, AWS, and Intel".
- `src/i18n/en.json` / `es.json` — `home.bio` if the summary changed.

---

## Verify

```bash
npm test
npm start        # http://localhost:5173
```

Check by hand:

1. `/` — new entry at the top of the timeline with the filled (active) dot; skills grid renders.
2. `/resume` — description, bullets, and skills all present; company name colored as expected.
3. Toggle **ES** in the sidebar — the Spanish entry appears in the same position with translated text.
4. Dates read correctly in both locales (`es-ES` vs `en-US` month names).

Tests mock the JSON modules, so `npm test` will **not** catch a content mistake. The manual check is
the real verification.

Then run [`commit-audit.md`](./commit-audit.md).
