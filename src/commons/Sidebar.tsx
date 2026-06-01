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
