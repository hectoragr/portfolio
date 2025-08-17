import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Faq from './FAQ/FAQ';
import HomePage from './HomePage/HomePage';
import NavBar from './commons/NavBar';
import Resume from './Resume/Resume';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n'; // Importing i18n configuration

function FourOhFour() {
  return <h1>404</h1>;
}

function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/faq" element={<Faq />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<FourOhFour />} />
      </Routes>
    </Router>
  );
}

export default App;
