/* Import statements */
import React from 'react';

/* Import pages */
//import ExchangeWarning from './pages/exchange-warning';

import './assets/stylesheets/app.scss';
import Address from './pages/address';


/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <Address/>
      </div>
    );
  }
};

export default App;
