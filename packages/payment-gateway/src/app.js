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
import { 
  TransitionGroup,
  CSSTransition 
} from 'react-transition-group';
import Container from './components/container';

/* App component */
class App extends React.Component {
  render() {
    return (
      <MemoryRouter>
        <Container/>
      </MemoryRouter>
    );
  }
};

export default App;

