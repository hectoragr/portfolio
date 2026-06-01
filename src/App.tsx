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
