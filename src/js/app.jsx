import React from 'react';

import Nav from './components/Nav';
import FeedbacksPage from './containers/FeedbacksPage';

const App = () => (
  <>
    <Nav className="site__nav">
      <img
        src="../assets/img/dashboard.svg"
        alt="Dashboard"
        className="site__icon"
        height="16px"
        width="16px"
      />Dashboard
    </Nav>
    <div className="site__content container">
      <FeedbacksPage />
    </div>
  </>
);

export default App;
