/* Import statements */
import React from 'react';
import './assets/stylesheets/app.scss';
import MetamaskHandler from './pages/metamask-handler';
import SelectWallet from './pages/select-wallet';
import TrezorHandler from './pages/trezor-handler';
//import LedgerHandler from './pages/ledger-handler';
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
            {/*<Route path="/ledger-handler" component={LedgerHandler}/>*/}
            <Route path="/metamask-handler" component={MetamaskHandler}/>
            <Route path="/trezor-handler" component={TrezorHandler}/>
          </Switch>
        </MemoryRouter>
      </div>
    );
  }
};

export default App;
