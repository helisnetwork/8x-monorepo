/* Import statements */
import React from 'react';

/* Import pages */
//import ExchangeWarning from './pages/exchange-warning';

import './assets/stylesheets/app.scss';
import ConfirmKey from './pages/confirm-key';


/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <ConfirmKey/>
      </div>
    );
  }
};

export default App;
