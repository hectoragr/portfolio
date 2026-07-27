import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// This site has never shipped a service worker, but the Create React App build
// that preceded it could leave one registered. Clear any that remain so nobody
// is served a stale cached shell.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then(registrations => registrations.forEach(registration => registration.unregister()))
    .catch(() => {
      /* nothing to clean up */
    });
}
