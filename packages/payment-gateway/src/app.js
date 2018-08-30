/* Import statements */
import React from 'react';

import './assets/stylesheets/app.scss';
import SelectWallet from './pages/select-wallet';

import {
  MemoryRouter,
  Route,
  Switch,
} from 'react-router-dom';

import MetamaskHandler from './pages/metamask-handler';
import TrezorHandler from './pages/trezor-handler';

/* App component */
class App extends React.Component {
  render() {
    return (
      <div>
        <MemoryRouter>
          <Switch>
            <Route exact path="/" component={SelectWallet}/>
            <Route path="/metamask-handler" component={MetamaskHandler}/>
            <Route path="/trezor-handler" component={TrezorHandler}/>
          </Switch>
        </MemoryRouter>
      </div>
    );
  }
};

export default App;
