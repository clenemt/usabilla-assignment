import React from 'react';
import { hot } from 'react-hot-loader';
import Confetti from 'react-dom-confetti';

import Nav from './components/Nav';
import FeedbacksPage from './containers/FeedbacksPage';

import dashboard from '../assets/img/dashboard.svg';

class App extends React.Component {
  constructor() {
    super();
    this.state = { wowFactor: false };
  }

  onClickTitle = () => {
    this.setState({ wowFactor: true }, () => this.setState({ wowFactor: false }));
  };

  render() {
    return (
      <>
        <Nav className="site__nav">
          <img src={dashboard} alt="Dashboard" className="site__icon" height="16px" width="16px" />
          <Confetti
            active={this.state.wowFactor}
            config={{
              angle: Math.random() * (360 - 180) + 180,
              spread: Math.random() * (200 - 60) + 60,
              startVelocity: 20,
              elementCount: 40,
              decay: 0.95,
            }}
          />
          <span className="site__9000" onClick={this.onClickTitle} tabIndex={0} role="button">
            Dashboard
          </span>
        </Nav>
        <div className="site__content container">
          <FeedbacksPage />
        </div>
      </>
    );
  }
}

export default hot(module)(App);
