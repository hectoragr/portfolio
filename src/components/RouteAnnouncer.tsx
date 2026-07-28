import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

/**
 * Client-side navigation does not trigger the page-load announcement screen
 * readers rely on, so the new page name is pushed into a live region instead.
 */
const ROUTE_TITLES: Record<string, { key: string; fallback: string }> = {
  '/': { key: 'nav.home', fallback: 'Home' },
  '/resume': { key: 'nav.resume', fallback: 'Resume' },
  '/projects': { key: 'nav.projects', fallback: 'Projects' },
};

const RouteAnnouncer: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  // Deliberately starts empty: assistive tech announces *changes* to a live
  // region, so seeding it on first paint would double-announce the landing page.
  const [message, setMessage] = useState('');

  useEffect(() => {
    const route = ROUTE_TITLES[pathname];
    setMessage(
      route ? t(route.key, route.fallback) : t('404.title', 'Page not found')
    );
  }, [pathname, t]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
};

export default RouteAnnouncer;
