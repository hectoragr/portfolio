import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import AppShell from './commons/AppShell';
import Projects from './Projects/Projects';
import HomePage from './HomePage/HomePage';
import Resume from './Resume/Resume';
import FourOhFour from './404';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <AppShell>
            <Routes>
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<FourOhFour />} />
            </Routes>
          </AppShell>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
