# Playbook: Add a page, route, or nav entry

Adding a route touches seven places. Missing any one of them ships a page that is unreachable,
untranslated, or invisible to search engines.

---

## Checklist

Using `/projects` as the worked example.

### 1. Component — `src/Projects/Projects.tsx`

Co-locate the component and its SCSS in a directory named after the page.

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import './Projects.scss';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="projects-page">
      <Helmet>
        <title>Projects | Héctor A. Gómez Reyes</title>
        <meta name="description" content="…" />
        <link rel="canonical" href="https://hectoragomez.com/projects" />
        <meta property="og:url" content="https://hectoragomez.com/projects" />
        <meta property="og:title" content="Projects | Héctor A. Gómez Reyes" />
      </Helmet>

      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__accent" />
          <h2 className="home-section__title">{t('projects.title', 'Projects')}</h2>
        </div>
      </section>
    </div>
  );
};

export default Projects;
```

The `home-section` / `home-section__accent` pattern is the established section header. Reuse it.

### 2. Styles — `src/Projects/Projects.scss`

```scss
@use '../styles/variables' as *;

.projects-page {
  max-width: 720px;   // matches .home-page
}
```

**Do not add page padding.** `.main-content` in `AppShell.scss` already applies `40px`
(`60px 20px 20px` under 767px) — a page-level padding doubles it. Pages set `max-width` and their own
content styles, nothing more.

Use tokens only — never a raw hex. BEM naming. Mobile breakpoint is **767px**.

There is no code splitting: every component's SCSS is compiled into one global stylesheet, so the
`home-section` classes defined in `HomePage.scss` are available to any page. Reuse them rather than
redefining the section-header look.

### 3. Route — `src/App.tsx`

```tsx
import Projects from './Projects/Projects';
…
<Route path="/projects" element={<Projects />} />
```

Keep the `path="*"` 404 route **last**.

### 4. Nav entry — `src/commons/Sidebar.tsx`

Add to the `navItems` array:

```tsx
{ to: '/projects', label: t('nav.projects', 'Projects'), icon: '🛠️', end: false },
```

`end: true` is only for `/` (exact match). External links are plain `<a>` elements below the
`navItems.map()` — see the AI Chat link for the pattern.

### 5. Translations — `src/i18n/{en,es}.json`

Add `nav.projects` and any page strings to **both** files.
Follow [`add-i18n-string.md`](./add-i18n-string.md) and run its parity check.

### 6. Sitemap — `public/sitemap.xml`

```xml
<url>
  <loc>https://hectoragomez.com/projects</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

Easy to forget and invisible until someone checks Search Console.

### 7. Test — `src/Projects/Projects.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './Projects';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { language: 'en' },
  }),
}));

describe('Projects', () => {
  it('renders the heading', () => {
    render(<MemoryRouter><Projects /></MemoryRouter>);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });
});
```

If you added a nav item, also extend `src/commons/Sidebar.test.tsx` — it asserts on the rendered
nav links.

---

## No infrastructure change is needed

CloudFront already maps **403 and 404 → `/index.html` (HTTP 200)**, so any client-side route resolves
in production without touching Terraform. If a new route 404s live, the cause is a stale CloudFront
cache, not missing config — see [`deploy-and-rollback.md`](./deploy-and-rollback.md).

---

## Verify

```bash
npm test
npm run build
npm start
```

Then in the browser:
1. Sidebar shows the new item; clicking it navigates and the item highlights (`--active`).
2. Deep-link `http://localhost:5173/projects` directly — must render, not 404.
3. Toggle ES — label and page content translate.
4. Narrow to < 767px — hamburger opens the drawer, tapping the item closes it (`onNavClick`).

Finish with [`commit-audit.md`](./commit-audit.md).
