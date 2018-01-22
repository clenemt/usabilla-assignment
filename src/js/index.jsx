import React from 'react';
import { render } from 'react-dom';

import App from './app';

const renderApp = () => {
  render(<App />, document.getElementById('root'));
};

renderApp();
