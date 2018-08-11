/* Import statements */
import React from 'react';

/* Import pages */
import ExchangeWarning from './pages/exchange-warning';

import './assets/stylesheets/app.scss';

/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <ExchangeWarning/>
      </div>
    );
  }
};

export default App;
