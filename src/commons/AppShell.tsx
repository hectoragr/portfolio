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
        <div
          className="sidebar-overlay"
          role="presentation"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
