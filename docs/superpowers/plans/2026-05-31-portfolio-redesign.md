# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the portfolio with a fixed left sidebar (card style, navy/red theme) and rich Home page (bio + skills grid + experience timeline), keeping existing routing, i18n, and resume data intact.

**Architecture:** Replace the `TopBar` + `Bottom` shell with an `AppShell` (flex row) containing a fixed 280px `Sidebar` and a scrollable `MainContent`. All three pages (Home, Resume, FAQ) keep their routing and logic; only CSS is reskinned. Bootstrap stays for grid utilities; a SCSS variables file provides all design tokens.

**Tech Stack:** React 19, TypeScript, React Router v7, react-i18next, Bootstrap 5, Sass (already installed), Vite 5, Vitest + @testing-library/react (added in Task 1).

---

## File Map

**Create:**
- `src/styles/_variables.scss` — design tokens (colors)
- `src/config/personal.ts` — personal links/info constants
- `src/commons/skills.json` — skills by category
- `src/commons/AppShell.tsx` — two-column layout wrapper
- `src/commons/AppShell.scss` — shell layout styles
- `src/commons/Sidebar.tsx` — fixed sidebar component
- `src/commons/Sidebar.scss` — sidebar styles
- `src/HomePage/HomePage.scss` — replaces HomePage.css
- `src/Resume/Resume.scss` — replaces Resume.css
- `src/FAQ/FAQ.scss` — FAQ page styles

**Modify:**
- `src/App.js → src/App.tsx` — use AppShell, remove TopBar/Bottom
- `src/HomePage/HomePage.tsx` — bio + skills grid + experience timeline
- `src/FAQ/FAQ.tsx` — add dark wrapper div
- `src/index.css` — dark body background
- `src/i18n/en.json` — add sidebar/nav keys
- `src/i18n/es.json` — add sidebar/nav keys
- `.gitignore` — add `.superpowers/`

**Delete:**
- `src/commons/TopBar.tsx`
- `src/commons/Bottom.tsx`
- `src/commons/Bottom.css`
- `src/HomePage/HomePage.css`
- `src/Resume/Resume.css`

---

## Task 1: Test infrastructure + gitignore

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Install Vitest + React Testing Library**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Create test setup file**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 3: Add Vitest config to vite.config.ts**

Replace the full contents of `vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, { loader: 'jsx' })
      },
    },
    react(),
  ],
  build: {
    outDir: 'build',
  },
  publicDir: 'public',
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:

```
# brainstorming visual companion
.superpowers/
```

- [ ] **Step 6: Verify Vitest works**

```bash
npx vitest run --reporter=verbose 2>&1 | head -20
```

Expected: "No test files found" or existing test output. No crash.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts package.json package-lock.json src/test/setup.ts .gitignore
git commit -m "chore: add Vitest + RTL, update gitignore"
```

---

## Task 2: Design tokens

**Files:**
- Create: `src/styles/_variables.scss`

- [ ] **Step 1: Create SCSS variables file**

Create `src/styles/_variables.scss`:

```scss
$navy-deep:    #1a1a2e;
$navy-mid:     #16213e;
$navy-light:   #0f3460;
$navy-border:  #1a3a6e;
$accent-red:   #e94560;
$text-primary: #ccd6f6;
$text-muted:   #8892b0;
$text-dim:     #6b7db3;
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/_variables.scss
git commit -m "chore: add SCSS design tokens"
```

---

## Task 3: Personal config

**Files:**
- Create: `src/config/personal.ts`

- [ ] **Step 1: Create personal config**

Create `src/config/personal.ts`:

```ts
export const PERSONAL = {
  name: 'Héctor A. Gómez',
  title: 'Software Engineer',
  location: 'Seattle, WA',
  email: 'hector.agr@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hagomezr',
  github: 'https://github.com/hagomezr',
  photo: '/assets/profile.jpg',
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/config/personal.ts
git commit -m "chore: add personal config constants"
```

---

## Task 4: Skills data

**Files:**
- Create: `src/commons/skills.json`

- [ ] **Step 1: Create skills JSON**

Create `src/commons/skills.json`:

```json
{
  "categories": [
    {
      "name": "Frontend",
      "nameEs": "Frontend",
      "skills": ["React", "TypeScript", "Redux", "HTML/CSS", "A11y"]
    },
    {
      "name": "Backend",
      "nameEs": "Backend",
      "skills": ["Java", "Spring Boot", "Node.js", "Python", "AWS Lambda"]
    },
    {
      "name": "Cloud & Infra",
      "nameEs": "Nube e Infra",
      "skills": ["AWS", "S3/CloudFront", "Terraform", "Step Functions", "Docker"]
    },
    {
      "name": "Tools",
      "nameEs": "Herramientas",
      "skills": ["Git", "Linux", "Figma", "TeamCity", "Postman"]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/commons/skills.json
git commit -m "chore: add skills data file"
```

---

## Task 5: i18n keys

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/es.json`

- [ ] **Step 1: Add new keys to en.json**

In `src/i18n/en.json`, replace the entire `"home"` block with:

```json
"home": {
  "title": "Home",
  "bio": "Software Engineer with experience building production systems at Oracle Cloud Infrastructure, Amazon Web Services, and Intel. I specialize in React, TypeScript, and cloud infrastructure — turning complex requirements into reliable, maintainable software.",
  "aboutTitle": "About Me",
  "skillsTitle": "Skills",
  "experienceTitle": "Experience"
}
```

And add a new `"nav"` block (at root level, alongside `"home"`, `"resume"`, `"404"`):

```json
"nav": {
  "home": "Home",
  "resume": "Resume",
  "faq": "Socials"
}
```

- [ ] **Step 2: Add new keys to es.json**

In `src/i18n/es.json`, replace the entire `"home"` block with:

```json
"home": {
  "title": "Inicio",
  "bio": "Ingeniero de Software con experiencia construyendo sistemas en producción en Oracle Cloud Infrastructure, Amazon Web Services e Intel. Me especializo en React, TypeScript e infraestructura en la nube — convirtiendo requerimientos complejos en software confiable y mantenible.",
  "aboutTitle": "Sobre Mí",
  "skillsTitle": "Habilidades",
  "experienceTitle": "Experiencia"
}
```

And add a `"nav"` block:

```json
"nav": {
  "home": "Inicio",
  "resume": "CV",
  "faq": "Redes Sociales"
}
```

- [ ] **Step 3: Verify Vite still starts**

```bash
npm run build 2>&1 | tail -5
```

Expected: build succeeds (exit 0).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/en.json src/i18n/es.json
git commit -m "feat: add sidebar and home i18n keys"
```

---

## Task 6: AppShell component

**Files:**
- Create: `src/commons/AppShell.tsx`
- Create: `src/commons/AppShell.scss`
- Create: `src/commons/AppShell.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/commons/AppShell.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppShell from './AppShell';

vi.mock('./Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe('AppShell', () => {
  it('renders sidebar and children', () => {
    render(
      <MemoryRouter>
        <AppShell>
          <div data-testid="content">Page content</div>
        </AppShell>
      </MemoryRouter>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/commons/AppShell.test.tsx --reporter=verbose
```

Expected: FAIL — "Cannot find module './AppShell'"

- [ ] **Step 3: Create AppShell.tsx**

Create `src/commons/AppShell.tsx`:

```tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './AppShell.scss';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <button
        className="hamburger"
        aria-label="Toggle menu"
        onClick={() => setSidebarOpen(o => !o)}
      >
        ☰
      </button>
      <div className={`sidebar-wrapper${sidebarOpen ? ' open' : ''}`}>
        <Sidebar onNavClick={() => setSidebarOpen(false)} />
      </div>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
```

- [ ] **Step 4: Create AppShell.scss**

Create `src/commons/AppShell.scss`:

```scss
@use '../styles/variables' as *;

.app-shell {
  display: flex;
  min-height: 100vh;
  background: $navy-deep;
  position: relative;
}

.sidebar-wrapper {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;

  @media (max-width: 767px) {
    position: fixed;
    left: -280px;
    transition: left 0.25s ease;

    &.open {
      left: 0;
    }
  }
}

.sidebar-overlay {
  display: none;

  @media (max-width: 767px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
}

.hamburger {
  display: none;
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 200;
  background: $navy-light;
  color: $text-primary;
  border: 1px solid $navy-border;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;

  @media (max-width: 767px) {
    display: block;
  }
}

.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  color: $text-primary;

  @media (max-width: 767px) {
    padding: 60px 20px 20px;
  }
}
```

- [ ] **Step 5: Run test — expect PASS**

```bash
npx vitest run src/commons/AppShell.test.tsx --reporter=verbose
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/commons/AppShell.tsx src/commons/AppShell.scss src/commons/AppShell.test.tsx
git commit -m "feat: add AppShell layout component"
```

---

## Task 7: Sidebar component

**Files:**
- Create: `src/commons/Sidebar.tsx`
- Create: `src/commons/Sidebar.scss`
- Create: `src/commons/Sidebar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/commons/Sidebar.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

const mockChangeLanguage = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { changeLanguage: mockChangeLanguage, language: 'en' },
  }),
}));

describe('Sidebar', () => {
  it('renders nav links', () => {
    render(<MemoryRouter><Sidebar onNavClick={() => {}} /></MemoryRouter>);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Socials')).toBeInTheDocument();
  });

  it('calls changeLanguage when EN button clicked', () => {
    render(<MemoryRouter><Sidebar onNavClick={() => {}} /></MemoryRouter>);
    fireEvent.click(screen.getByText('EN'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('calls changeLanguage when ES button clicked', () => {
    render(<MemoryRouter><Sidebar onNavClick={() => {}} /></MemoryRouter>);
    fireEvent.click(screen.getByText('ES'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  it('calls onNavClick when a nav link is clicked', () => {
    const onNavClick = vi.fn();
    render(<MemoryRouter><Sidebar onNavClick={onNavClick} /></MemoryRouter>);
    fireEvent.click(screen.getByText('Home'));
    expect(onNavClick).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/commons/Sidebar.test.tsx --reporter=verbose
```

Expected: FAIL — "Cannot find module './Sidebar'"

- [ ] **Step 3: Create Sidebar.tsx**

Create `src/commons/Sidebar.tsx`:

```tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PERSONAL } from '../config/personal';
import './Sidebar.scss';

interface SidebarProps {
  onNavClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const navItems = [
    { to: '/', label: t('nav.home', 'Home'), icon: '🏠', end: true },
    { to: '/resume', label: t('nav.resume', 'Resume'), icon: '📄', end: false },
    { to: '/faq', label: t('nav.faq', 'Socials'), icon: '🔗', end: false },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__profile">
        <div className="sidebar__photo-ring">
          <img
            src={PERSONAL.photo}
            alt={PERSONAL.name}
            className="sidebar__photo"
          />
        </div>
        <h1 className="sidebar__name">{PERSONAL.name}</h1>
        <p className="sidebar__title">{t('resume.softwareEngineer', PERSONAL.title)}</p>
      </div>

      <div className="sidebar__divider sidebar__divider--red" />

      <div className="sidebar__socials">
        <a
          href={PERSONAL.linkedin}
          target="_blank"
          rel="noreferrer"
          className="sidebar__social-btn"
          aria-label="LinkedIn"
        >
          in
        </a>
        <a
          href={PERSONAL.github}
          target="_blank"
          rel="noreferrer"
          className="sidebar__social-btn"
          aria-label="GitHub"
        >
          gh
        </a>
        <a
          href={`mailto:${PERSONAL.email}`}
          className="sidebar__social-btn"
          aria-label="Email"
        >
          ✉
        </a>
      </div>

      <div className="sidebar__divider" />

      <nav className="sidebar__nav">
        <span className="sidebar__nav-label">Menu</span>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
            }
            onClick={onNavClick}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__divider" />

      <div className="sidebar__lang">
        <button
          className={`sidebar__lang-btn${i18n.language === 'en' ? ' sidebar__lang-btn--active' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
        <button
          className={`sidebar__lang-btn${i18n.language === 'es' ? ' sidebar__lang-btn--active' : ''}`}
          onClick={() => changeLanguage('es')}
        >
          ES
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
```

- [ ] **Step 4: Create Sidebar.scss**

Create `src/commons/Sidebar.scss`:

```scss
@use '../styles/variables' as *;

.sidebar {
  width: 280px;
  min-height: 100vh;
  background: $navy-deep;
  display: flex;
  flex-direction: column;
  border-right: 1px solid $navy-border;
}

// Profile section
.sidebar__profile {
  background: linear-gradient(160deg, $navy-light 0%, $navy-deep 100%);
  padding: 32px 20px 24px;
  text-align: center;
}

.sidebar__photo-ring {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  border: 3px solid $accent-red;
  margin: 0 auto 14px;
  overflow: hidden;
  background: $navy-light;
}

.sidebar__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.sidebar__name {
  color: $text-primary;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin: 0 0 6px;
}

.sidebar__title {
  color: $accent-red;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0;
  font-weight: 500;
}

// Dividers
.sidebar__divider {
  height: 1px;
  background: $navy-light;
  margin: 0 20px;

  &--red {
    background: linear-gradient(to right, transparent, $accent-red, transparent);
  }
}

// Social icons
.sidebar__socials {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 16px 20px;
}

.sidebar__social-btn {
  width: 36px;
  height: 36px;
  background: $navy-light;
  border: 1px solid $navy-border;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  font-size: 12px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: $accent-red;
    color: #fff;
    border-color: $accent-red;
  }
}

// Navigation
.sidebar__nav {
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar__nav-label {
  display: block;
  color: $text-dim;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
  padding-left: 4px;
}

.sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 7px;
  color: $text-muted;
  font-size: 13px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: $navy-light;
    color: $text-primary;
  }

  &--active {
    background: $accent-red;
    color: #fff;

    &:hover {
      background: darken(#e94560, 8%);
      color: #fff;
    }
  }
}

.sidebar__nav-icon {
  font-size: 15px;
  line-height: 1;
}

// Language toggle
.sidebar__lang {
  display: flex;
  gap: 8px;
  padding: 16px 20px 24px;
}

.sidebar__lang-btn {
  flex: 1;
  padding: 7px;
  border-radius: 5px;
  border: 1px solid $navy-border;
  background: $navy-light;
  color: $text-muted;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &--active {
    background: $accent-red;
    color: #fff;
    border-color: $accent-red;
  }

  &:hover:not(&--active) {
    background: $navy-border;
    color: $text-primary;
  }
}
```

- [ ] **Step 5: Run test — expect PASS**

```bash
npx vitest run src/commons/Sidebar.test.tsx --reporter=verbose
```

Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/commons/Sidebar.tsx src/commons/Sidebar.scss src/commons/Sidebar.test.tsx
git commit -m "feat: add Sidebar component with nav, socials, language toggle"
```

---

## Task 8: Wire up App.tsx

**Files:**
- Create: `src/App.tsx` (rename from App.js)
- Delete: `src/commons/TopBar.tsx`, `src/commons/Bottom.tsx`, `src/commons/Bottom.css`

- [ ] **Step 1: Create App.tsx**

Create `src/App.tsx` (keep `src/App.js` for now — delete after):

```tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppShell from './commons/AppShell';
import Faq from './FAQ/FAQ';
import HomePage from './HomePage/HomePage';
import Resume from './Resume/Resume';
import FourOhFour from './404';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppShell>
          <Routes>
            <Route path="/faq" element={<Faq />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<FourOhFour />} />
          </Routes>
        </AppShell>
      </Router>
    </HelmetProvider>
  );
};

export default App;
```

- [ ] **Step 2: Delete old files**

```bash
rm src/App.js src/commons/TopBar.tsx src/commons/Bottom.tsx src/commons/Bottom.css
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds. If it fails on `App.test.js` (old test uses ReactDOM.render), delete the stale test:

```bash
rm src/App.test.js
```

Re-run build:

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Start dev server and verify sidebar renders**

```bash
npm run start &
```

Open http://localhost:5173. Expected: sidebar visible on left with profile area, dark background. Pages accessible via nav.

```bash
kill %1
```

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git rm src/App.js src/commons/TopBar.tsx src/commons/Bottom.tsx src/commons/Bottom.css src/App.test.js 2>/dev/null; true
git commit -m "feat: wire AppShell into App, remove TopBar and Bottom"
```

---

## Task 9: Update global styles

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace index.css contents**

Replace the full contents of `src/index.css` with:

```css
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #1a1a2e;
  color: #ccd6f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  -webkit-font-smoothing: antialiased;
}

a {
  color: #e94560;
}

a:hover {
  color: #ff6b85;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: dark global styles"
```

---

## Task 10: HomePage redesign

**Files:**
- Modify: `src/HomePage/HomePage.tsx`
- Create: `src/HomePage/HomePage.scss` (replaces HomePage.css)
- Delete: `src/HomePage/HomePage.css`
- Create: `src/HomePage/HomePage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/HomePage/HomePage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../commons/skills.json', () => ({
  default: {
    categories: [
      { name: 'Frontend', nameEs: 'Frontend', skills: ['React', 'TypeScript'] },
    ],
  },
}));

vi.mock('../commons/work-experience.json', () => ({
  default: {
    en: {
      jobs: [
        {
          title: 'SDE II',
          company: 'Oracle America Inc.',
          location: 'Seattle, WA (US)',
          startDate: '2019-04-19',
          endDate: '2025-09-30',
        },
      ],
    },
  },
}));

describe('HomePage', () => {
  it('renders About Me section', () => {
    render(<HomePage />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('renders Skills section', () => {
    render(<HomePage />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders Experience section', () => {
    render(<HomePage />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Oracle America Inc.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/HomePage/HomePage.test.tsx --reporter=verbose
```

Expected: FAIL

- [ ] **Step 3: Rewrite HomePage.tsx**

Replace full contents of `src/HomePage/HomePage.tsx`:

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import skillsData from '../commons/skills.json';
import workData from '../commons/work-experience.json';
import './HomePage.scss';

type WorkData = {
  en: { jobs: Job[] };
  es: { jobs: Job[] };
};

type Job = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
};

type SkillCategory = {
  name: string;
  nameEs: string;
  skills: string[];
};

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'es' ? 'es' : 'en';
  const jobs = (workData as WorkData)[lang].jobs;

  const fromDate = (date: string) => {
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return new Date(date).toLocaleString(locale, { year: 'numeric', month: 'short' });
  };

  const toDate = (date: string) => {
    if (new Date(date).getTime() > Date.now()) return t('resume.present', 'Present');
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return new Date(date).toLocaleString(locale, { year: 'numeric', month: 'short' });
  };

  return (
    <div className="home-page">
      <Helmet>
        <title>Héctor A. Gómez Reyes | Software Engineer</title>
        <meta name="description" content="Personal website of Héctor A. Gómez Reyes — Software Engineer with experience at Oracle, AWS, and Intel. React, TypeScript, Java, and cloud infrastructure." />
        <link rel="canonical" href="https://hectoragomez.com" />
        <meta property="og:url" content="https://hectoragomez.com" />
        <meta property="og:title" content="Héctor A. Gómez Reyes | Software Engineer" />
        <meta property="og:description" content="Personal website of Héctor A. Gómez Reyes — Software Engineer with experience at Oracle, AWS, and Intel." />
      </Helmet>

      {/* About */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__accent" />
          <h2 className="home-section__title">{t('home.aboutTitle', 'About Me')}</h2>
        </div>
        <p className="home-section__bio">{t('home.bio', 'Software Engineer with experience building production systems at Oracle Cloud Infrastructure, Amazon Web Services, and Intel.')}</p>
      </section>

      {/* Skills */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__accent" />
          <h2 className="home-section__title">{t('home.skillsTitle', 'Skills')}</h2>
        </div>
        <div className="skills-grid">
          {(skillsData.categories as SkillCategory[]).map(cat => (
            <div key={cat.name} className="skills-card">
              <div className="skills-card__category">
                {lang === 'es' ? cat.nameEs : cat.name}
              </div>
              <div className="skills-card__tags">
                {cat.skills.map(skill => (
                  <span key={skill} className="skills-card__tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="home-section">
        <div className="home-section__header">
          <div className="home-section__accent" />
          <h2 className="home-section__title">{t('home.experienceTitle', 'Experience')}</h2>
        </div>
        <div className="experience-timeline">
          {jobs.map((job, idx) => (
            <div key={idx} className="timeline-item">
              <div className={`timeline-item__dot${idx === 0 ? ' timeline-item__dot--active' : ''}`} />
              <div className="timeline-item__content">
                <div className="timeline-item__period">
                  {fromDate(job.startDate)} — {toDate(job.endDate)}
                </div>
                <div className="timeline-item__company">{job.company}</div>
                <div className="timeline-item__title">{job.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

- [ ] **Step 4: Create HomePage.scss**

Create `src/HomePage/HomePage.scss`:

```scss
@use '../styles/variables' as *;

.home-page {
  max-width: 720px;
}

.home-section {
  margin-bottom: 40px;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  &__accent {
    width: 4px;
    height: 26px;
    background: $accent-red;
    border-radius: 2px;
    flex-shrink: 0;
  }

  &__title {
    color: $text-primary;
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }

  &__bio {
    color: $text-muted;
    font-size: 15px;
    line-height: 1.75;
    margin: 0;
  }
}

// Skills
.skills-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.skills-card {
  background: $navy-mid;
  border-radius: 8px;
  padding: 14px 16px;
  border: 1px solid $navy-border;

  &__category {
    color: $accent-red;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 10px;
    font-weight: 600;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__tag {
    background: $navy-light;
    color: $text-primary;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 12px;
  }
}

// Experience timeline
.experience-timeline {
  position: relative;
  padding-left: 22px;
  border-left: 2px solid $navy-light;
}

.timeline-item {
  position: relative;
  margin-bottom: 22px;

  &:last-child {
    margin-bottom: 0;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $navy-light;
    border: 2px solid $text-dim;
    position: absolute;
    left: -28px;
    top: 4px;

    &--active {
      background: $accent-red;
      border-color: $accent-red;
    }
  }

  &__period {
    color: $text-dim;
    font-size: 11px;
    margin-bottom: 3px;
  }

  &__company {
    color: $text-primary;
    font-size: 15px;
    font-weight: 600;
  }

  &__title {
    color: $text-muted;
    font-size: 13px;
    margin-top: 2px;
  }
}
```

- [ ] **Step 5: Delete old CSS file**

```bash
rm src/HomePage/HomePage.css
```

- [ ] **Step 6: Run test — expect PASS**

```bash
npx vitest run src/HomePage/HomePage.test.tsx --reporter=verbose
```

Expected: PASS (3 tests)

- [ ] **Step 7: Commit**

```bash
git add src/HomePage/HomePage.tsx src/HomePage/HomePage.scss src/HomePage/HomePage.test.tsx
git rm src/HomePage/HomePage.css
git commit -m "feat: redesign HomePage with bio, skills grid, experience timeline"
```

---

## Task 11: Resume reskin

**Files:**
- Create: `src/Resume/Resume.scss` (replaces Resume.css)
- Delete: `src/Resume/Resume.css`
- Modify: `src/Resume/Resume.tsx` (update CSS import only)

- [ ] **Step 1: Create Resume.scss**

Create `src/Resume/Resume.scss`:

```scss
@use '../styles/variables' as *;

.resume-container {
  max-width: 900px;
  padding: 20px;
  color: $text-muted;
}

.resume-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid $navy-light;

  h2 {
    color: $text-primary;
    font-size: 24px;
    margin-bottom: 8px;
  }

  sub {
    font-size: 0.45em;
    color: $text-dim;
  }

  p {
    margin: 4px 0;
    color: $text-muted;
    font-size: 14px;
  }

  a {
    color: $accent-red;
    &:hover { color: lighten(#e94560, 15%); }
  }
}

h3 {
  color: $text-primary;
  font-size: 18px;
  font-weight: 700;
  margin-top: 32px;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid $accent-red;
  text-align: left;
}

.work-item,
.education-item {
  background: $navy-mid;
  border: 1px solid $navy-border;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;

  h5 {
    color: $text-primary;
    font-size: 14px;
    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 8px;
  }

  ul {
    padding-left: 18px;
    margin-bottom: 8px;

    li {
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 4px;
    }
  }
}

.oracle-span {
  color: #e94560;
  font-weight: bold;
}

.amazon-span {
  color: #f90;
  font-weight: bold;
}

.intel-span {
  color: #0071c5;
  font-weight: bold;
}

.itesm-span {
  color: #4caf50;
  font-weight: bold;
}

.udemy-span {
  color: #a435f0;
  font-weight: bold;
}

.skills-tag {
  color: $accent-red;
  font-weight: 700;
}

@media print {
  html { font-size: 65%; }
  .outside-work { display: none !important; }
}

@media screen and (min-width: 1200px) {
  .resume-container {
    width: 900px;
    margin: auto;
  }
}
```

- [ ] **Step 2: Update CSS import in Resume.tsx**

In `src/Resume/Resume.tsx`, replace:

```tsx
import './Resume.css'; // Assuming you have some CSS for styling
```

with:

```tsx
import './Resume.scss';
```

- [ ] **Step 3: Delete old CSS file**

```bash
rm src/Resume/Resume.css
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -5
```

Expected: success.

- [ ] **Step 5: Commit**

```bash
git add src/Resume/Resume.scss src/Resume/Resume.tsx
git rm src/Resume/Resume.css
git commit -m "feat: reskin Resume page to navy/red theme"
```

---

## Task 12: FAQ dark wrapper

**Files:**
- Modify: `src/FAQ/FAQ.tsx`
- Create: `src/FAQ/FAQ.scss`

- [ ] **Step 1: Create FAQ.scss**

Create `src/FAQ/FAQ.scss`:

```scss
@use '../styles/variables' as *;

.faq-page {
  min-height: 60vh;
}
```

- [ ] **Step 2: Update FAQ.tsx**

Replace full contents of `src/FAQ/FAQ.tsx`:

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import './FAQ.scss';

const Faq: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Socials | Héctor A. Gómez Reyes</title>
        <meta name="description" content="Social links and contact info for Héctor A. Gómez Reyes — Software Engineer." />
        <link rel="canonical" href="https://hectoragomez.com/faq" />
      </Helmet>
      <div className="faq-page">
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <div
          className="elfsight-app-fa34dd46-8657-4fdb-8fa8-a07b59345724"
          data-elfsight-app-lazy
        />
      </div>
    </div>
  );
};

export default Faq;
```

- [ ] **Step 3: Commit**

```bash
git add src/FAQ/FAQ.tsx src/FAQ/FAQ.scss
git commit -m "feat: update FAQ with dark wrapper and typed component"
```

---

## Task 13: Final verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run --reporter=verbose
```

Expected: all tests PASS, 0 failures.

- [ ] **Step 2: Build for production**

```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds with output in `build/`.

- [ ] **Step 3: Start preview and manually verify**

```bash
npm run preview &
```

Open http://localhost:4173. Check:
- [ ] Sidebar visible with photo, name, nav pills
- [ ] Home page shows 3 sections (About, Skills, Experience)
- [ ] Active nav item highlights red when on that page
- [ ] EN/ES toggle switches language
- [ ] Resume page loads with dark theme, company colors preserved
- [ ] Socials (FAQ) page loads without white background clash
- [ ] Mobile: hamburger button visible, sidebar slides in/out
- [ ] 404 page accessible at http://localhost:4173/notfound

```bash
kill %1
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: portfolio redesign complete — verify pass"
```
