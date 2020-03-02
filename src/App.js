import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Faq from './FAQ/FAQ';
import HomePage from './HomePage/HomePage';
import NavBar from './commons/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Status({ code, children }) {
  return (
      <Route render={({ staticContext }) => {
          if (staticContext) staticContext.status = code;
          return children;
      }} />
  );
}

function FourOhFour() {
  return (
      <Status code={404}>
          <h1>404</h1>
      </Status>
  );
}

function App() {
  return (
    <Router>
      <NavBar/>
      <Switch>
        <Route path="/faq">
          <Faq/>
        </Route>
        <Route path="/" exact={true}>
          <HomePage/>
        </Route>
        <Route component={FourOhFour} />
      </Switch>
    </Router>
  );
}

export default App;
