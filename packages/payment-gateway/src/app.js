/* Import statements */
import React from 'react';

/* Import pages */
//import ExchangeWarning from './pages/exchange-warning';

import './assets/stylesheets/app.scss';
import PrivatekeyWarning from './pages/privatekey-warning';


/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <PrivatekeyWarning/>
      </div>
    );
  }
};

export default App;
