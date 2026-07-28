import React, { useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import SkipLink from '../components/SkipLink';
import RouteAnnouncer from '../components/RouteAnnouncer';
import useFocusOnRouteChange from '../hooks/useFocusOnRouteChange';
import useFocusTrap from '../hooks/useFocusTrap';
import './AppShell.scss';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useFocusOnRouteChange(mainRef);

  // Returning focus to the trigger is required by WCAG 2.4.3; without it focus
  // falls back to <body> and keyboard users lose their place.
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useFocusTrap(drawerRef, sidebarOpen, closeSidebar);

  return (
    <div className="app-shell">
      <SkipLink />
      <RouteAnnouncer />
      <button
        ref={hamburgerRef}
        type="button"
        className="hamburger"
        aria-label={t('a11y.toggleMenu', 'Toggle menu')}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar-drawer"
        onClick={() => setSidebarOpen(open => !open)}
      >
        ☰
      </button>
      <div
        id="sidebar-drawer"
        ref={drawerRef}
        className={`sidebar-wrapper${sidebarOpen ? ' open' : ''}`}
        // Only a dialog while it overlays the page as a mobile drawer. On
        // desktop it is a persistent column, and claiming aria-modal there
        // would tell assistive tech the rest of the page is unavailable.
        role={sidebarOpen ? 'dialog' : undefined}
        aria-modal={sidebarOpen ? true : undefined}
        aria-label={
          sidebarOpen ? t('a11y.navigationMenu', 'Navigation menu') : undefined
        }
      >
        <Sidebar onNavClick={closeSidebar} />
      </div>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          role="presentation"
          aria-hidden="true"
          onClick={closeSidebar}
        />
      )}
      <main
        id="main-content"
        className="main-content"
        ref={mainRef}
        tabIndex={-1}
      >
        {/* <article> gives Safari Reader Mode a content root to detect.
            Keying on pathname remounts it per route, which restarts the
            fade-in animation. */}
        <article key={pathname} className="route-fade">
          {children}
        </article>
      </main>
    </div>
  );
};

export default AppShell;
