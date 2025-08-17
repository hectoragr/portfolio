import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Faq from './FAQ/FAQ';
import HomePage from './HomePage/HomePage';
import Resume from './Resume/Resume';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n'; // Importing i18n configuration
import TopBar from './commons/TopBar';
import Bottom from './commons/Bottom';
import FourOhFour from './404';

function App() {
  return (
    <Router>
      <TopBar/>
      <Routes>
        <Route path="/faq" element={<Faq />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<FourOhFour />} />
      </Routes>
      <Bottom />
    </Router>
  );
}

export default App;
