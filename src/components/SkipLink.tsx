import React from 'react';
import { useTranslation } from 'react-i18next';
import './SkipLink.scss';

/**
 * Bypass link for keyboard and screen reader users (WCAG 2.4.1).
 *
 * Must stay the first focusable element in the DOM, so it is rendered at the
 * very top of AppShell — ahead of the hamburger and the sidebar.
 */
const SkipLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <a href="#main-content" className="skip-link">
      {t('a11y.skipToContent', 'Skip to main content')}
    </a>
  );
};

export default SkipLink;
