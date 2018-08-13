/* Import statements */
import React from 'react';

/* Import pages */
//import ExchangeWarning from './pages/exchange-warning';

import './assets/stylesheets/app.scss';
import Privatekey from './pages/privatekey';


/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <Privatekey/>
      </div>
    );
  }
};

export default App;
