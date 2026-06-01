# Portfolio Redesign — Design Spec

**Date:** 2026-05-31  
**Status:** Approved

## Overview

Modernize the portfolio to match the vCard2 template aesthetic (https://preview.colorlib.com/#vcard2). Keep existing routing structure (Home / Resume / FAQ) and all business logic (i18n, resume JSON data). Replace the top-nav + footer shell with a fixed left sidebar + scrollable main content layout.

## Decisions

| Decision | Choice |
|---|---|
| Navigation | Multi-page router (React Router), sidebar replaces top nav |
| Pages | Keep: Home, Resume, FAQ |
| Sidebar style | Card style — large circle photo, name/title, social icons, pill nav |
| Color scheme | Dark Navy + Red (`#1a1a2e` / `#e94560`) |
| Profile photo | `public/assets/profile.jpg` (converted from HEIC) |
| Home content | Bio + skills grid + experience timeline |
| i18n | Keep EN/ES toggle in sidebar |
| CSS approach | Migration — keep Bootstrap, add custom SCSS layer |

## Architecture

### Shell change

**Before:**
```
App.js
└── Router
    ├── TopBar
    ├── Routes (/, /resume, /faq, *)
    └── Bottom
```

**After:**
```
App.tsx
└── Router
    └── AppShell
        ├── Sidebar (fixed, 280px)
        └── MainContent (flex-grow, scrollable)
            └── Routes (/, /resume, /faq, *)
```

`TopBar.tsx` and `Bottom.tsx` are deleted. `App.js` is renamed to `App.tsx`.

### New files

| File | Purpose |
|---|---|
| `src/commons/AppShell.tsx` | Two-column layout wrapper |
| `src/commons/AppShell.scss` | Shell layout styles |
| `src/commons/Sidebar.tsx` | Fixed sidebar component |
| `src/commons/Sidebar.scss` | Sidebar styles |
| `src/styles/_variables.scss` | SCSS design tokens |

### Deleted files

- `src/commons/TopBar.tsx`
- `src/commons/Bottom.tsx`
- `src/commons/Bottom.css`

### Modified files

| File | Change |
|---|---|
| `src/App.js → App.tsx` | Use `AppShell`, remove `TopBar`/`Bottom` imports, convert to TS |
| `src/HomePage/HomePage.tsx` | Replace placeholder text with bio + skills grid + experience timeline |
| `src/HomePage/HomePage.css → HomePage.scss` | Reskin to navy/red theme |
| `src/Resume/Resume.tsx` | CSS class updates only |
| `src/Resume/Resume.css → Resume.scss` | Reskin to navy/red theme |
| `src/FAQ/FAQ.tsx` | Add dark wrapper div |

## Component Designs

### `Sidebar.tsx`

```
Sidebar
├── Profile section (gradient header)
│   ├── <img> profile.jpg — circle crop, red border ring
│   ├── Name: "Héctor A. Gómez"
│   └── Title: "Software Engineer"
├── Divider (red gradient line)
├── Social icons row
│   ├── LinkedIn → https://linkedin.com/in/hagomezr
│   ├── GitHub → external link
│   └── Email → mailto
├── Divider
├── Nav pills (React Router NavLink, active = red fill)
│   ├── 🏠 Home → /
│   ├── 📄 Resume → /resume
│   └── ❓ FAQ → /faq
├── Divider
└── Language toggle (EN / ES buttons, active = red fill)
```

**Responsive:** On mobile (< 768px), sidebar collapses to a top bar with hamburger menu. Hamburger toggles sidebar visibility as an overlay drawer.

### `AppShell.tsx`

```tsx
<div className="app-shell">
  <Sidebar />
  <main className="main-content">
    {children}
  </main>
</div>
```

Layout: `display: flex`, sidebar `width: 280px; flex-shrink: 0; position: sticky; height: 100vh`, main `flex: 1; overflow-y: auto`.

### `HomePage.tsx`

Three stacked sections, each with red left-border accent heading:

1. **About Me** — bio paragraph (i18n keys: `home.bio`). Placeholder text until user supplies real copy.
2. **Skills** — 2×2 grid of category cards (Frontend, Backend, Cloud & Infra, Tools). Data from `src/commons/skills.json` (new file).
3. **Experience** — vertical timeline. Data from existing `src/commons/work-experience.json`, shows company + title + date range only (not full bullets — Resume page has full detail).

## SCSS Design Tokens

`src/styles/_variables.scss`:

```scss
$navy-deep:    #1a1a2e;   // page/sidebar background
$navy-mid:     #16213e;   // card/section background
$navy-light:   #0f3460;   // inner card / hover state
$navy-border:  #1a3a6e;   // borders, dividers
$accent-red:   #e94560;   // primary accent, active states
$text-primary: #ccd6f6;   // headings
$text-muted:   #8892b0;   // body text
$text-dim:     #6b7db3;   // labels, metadata
```

All new `.scss` files import this via `@use` with a relative path to `src/styles/_variables.scss`.

## Data Files

### Existing (unchanged structure)
- `src/commons/work-experience.json` — jobs, education, other (EN + ES)

### New
- `src/commons/skills.json` — skills by category

```json
{
  "categories": [
    { "name": "Frontend", "skills": ["React", "TypeScript", "HTML/CSS"] },
    { "name": "Backend", "skills": ["Java", "Node.js", "Python"] },
    { "name": "Cloud & Infra", "skills": ["AWS", "S3/CloudFront", "Terraform"] },
    { "name": "Tools", "skills": ["Git", "Docker", "Linux"] }
  ]
}
```

User should update skill lists to match actual expertise.

## i18n

Existing `src/i18n/en.json` and `src/i18n/es.json` get new keys:

```json
{
  "home.bio": "...",
  "sidebar.title": "Software Engineer",
  "nav.home": "Home",
  "nav.resume": "Resume",
  "nav.faq": "FAQ"
}
```

Existing resume keys (`resume.*`) are unchanged.

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| ≥ 768px | Fixed sidebar (280px) + scrollable main |
| < 768px | Sidebar hidden, top bar with hamburger; sidebar slides in as overlay on toggle |

## Out of Scope

- No new pages or routes
- No animation library (CSS transitions only)
- No changes to FAQ Elfsight widget
- No changes to SEO/Helmet metadata structure
- No changes to `work-experience.json` data
