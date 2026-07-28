import React from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PERSONAL } from '../config/personal';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.scss';

interface SidebarProps {
  onNavClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const themeToggleLabel =
    theme === 'dark'
      ? t('theme.toggleLight', 'Switch to light theme')
      : t('theme.toggleDark', 'Switch to dark theme');

  const navItems = [
    { to: '/', label: t('nav.home', 'Home'), icon: '🏠', end: true },
    { to: '/resume', label: t('nav.resume', 'Resume'), icon: '📄', end: false },
    { to: '/projects', label: t('nav.projects', 'Projects'), icon: '🗂', end: false },
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
        {/* Not a heading: the sidebar is site-wide furniture, so the single
            <h1> belongs to whichever page is rendered in <main>. */}
        <p className="sidebar__name">{PERSONAL.name}</p>
        <p className="sidebar__title">{t('resume.softwareEngineer', PERSONAL.title)}</p>
      </div>

      <div className="sidebar__divider sidebar__divider--red" />

      {/* Icons are decorative; the accessible name comes from aria-label on
          each link, so the SVGs are hidden from assistive tech. */}
      <div className="sidebar__socials">
        <a
          href={PERSONAL.linkedin}
          target="_blank"
          rel="noreferrer"
          className="sidebar__social-btn"
          aria-label="LinkedIn"
        >
          <svg
            className="sidebar__social-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.1 8.75 21 11 21 14.1V21h-4v-6.1c0-1.46-.52-2.45-1.83-2.45-1 0-1.6.67-1.86 1.32-.1.23-.12.55-.12.87V21H9z" />
          </svg>
        </a>
        <a
          href={PERSONAL.github}
          target="_blank"
          rel="noreferrer"
          className="sidebar__social-btn"
          aria-label="GitHub"
        >
          <svg
            className="sidebar__social-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.540-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12A11.5 11.5 0 0 0 12 .5z" />
          </svg>
        </a>
        <a
          href={`mailto:${PERSONAL.email}`}
          className="sidebar__social-btn"
          aria-label="Email"
        >
          <svg
            className="sidebar__social-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 8.13L3.4 6H20.6zM3 18h18V8.24l-8.42 6a1 1 0 0 1-1.16 0L3 8.24z" />
          </svg>
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
            aria-label={item.label}
          >
            <span className="sidebar__nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
        <a
          href="https://chat.hectoragomez.com"
          target="_blank"
          rel="noreferrer"
          className="sidebar__nav-item"
          onClick={onNavClick}
          aria-label={t('nav.chat', 'AI Chat')}
        >
          <span className="sidebar__nav-icon" aria-hidden="true">
            🤖
          </span>
          {t('nav.chat', 'AI Chat')}
        </a>
      </nav>

      <div className="sidebar__divider" />

      {/* Language and theme share one row so they read as a single settings
          group rather than a stray floating button. */}
      <div className="sidebar__controls">
        <button
          type="button"
          className={`sidebar__lang-btn${i18n.language === 'en' ? ' sidebar__lang-btn--active' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
        <button
          type="button"
          className={`sidebar__lang-btn${i18n.language === 'es' ? ' sidebar__lang-btn--active' : ''}`}
          onClick={() => changeLanguage('es')}
        >
          ES
        </button>
        {/* The label describes the action the click performs, not the current
            theme, so screen reader users hear what will happen. The icon shows
            the theme being switched *to*. */}
        <button
          type="button"
          className="sidebar__theme-btn"
          onClick={toggleTheme}
          aria-label={themeToggleLabel}
          title={themeToggleLabel}
        >
          {theme === 'dark' ? (
            <svg
              className="sidebar__theme-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="12" r="4.3" />
              <path d="M12 2.2v2.4M12 19.4v2.4M2.2 12h2.4M19.4 12h2.4M5.1 5.1l1.7 1.7M17.2 17.2l1.7 1.7M18.9 5.1l-1.7 1.7M6.8 17.2l-1.7 1.7" />
            </svg>
          ) : (
            <svg
              className="sidebar__theme-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20.4 14.3A8.6 8.6 0 1 1 9.7 3.6a6.9 6.9 0 0 0 10.7 10.7z" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
