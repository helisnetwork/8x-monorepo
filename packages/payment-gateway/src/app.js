/* Import statements */
import React from 'react';

import './assets/stylesheets/app.scss';
import SelectWallet from './pages/select-wallet';
import SubscriptionInfo from './pages/subscripton-info';

import {
  MemoryRouter,
  Route,
  Switch,
} from 'react-router-dom';

/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <MemoryRouter>
          <Switch>
            <Route exact path="/" component={SelectWallet}/>
            <Route path="/subscription-info" component={SubscriptionInfo}/>
          </Switch>
        </MemoryRouter>
      </div>
    );
  }
};

export default App;
