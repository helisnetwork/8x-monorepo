/* Import statements */
import React from 'react';

/* Import pages */
//import ExchangeWarning from './pages/exchange-warning';

import './assets/stylesheets/app.scss';
import SubscriptionInfo from './pages/subscripton-info';


/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <SubscriptionInfo/>
      </div>
    );
  }
};

export default App;
