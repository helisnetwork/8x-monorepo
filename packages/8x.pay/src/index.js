/*

------------------------------------------------------------

Create a .env file and fill in the following variables below

------------------------------------------------------------

# Executor contract address
EXECUTOR = ""

# Transcting token address (that you'd like to stake for)
TRANSACTING_TOKEN = ""

# Volume subscription address
VOLUME_SUBSCRIPTION = ""

# Transfer proxy address
TRANSFER_PROXY = ""

*/

/* Import statements */
import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import {
  TransitionGroup,
  CSSTransition
} from 'react-transition-group';

import Container from './components/container';
import ModalLauncher from './components/modal-launcher';
import UserStore from './store/user';
import SubscriptionStore from './store/subscription';

import bus from './bus';
import './assets/stylesheets/app.scss';

/* App component */
class EightExPay extends React.Component {

  constructor(props) {
    super(props);

    let userStore = new UserStore();
    let subscriptionStore = new SubscriptionStore();

    console.log(`plan triggered: ${props.planHash}`);
    bus.trigger('planhash:sent', props.planHash);

    bus.on('user:activate:completed', (subscriptionHash, status) => {
      if (props.activated) {
        props.activated(subscriptionHash, status);
        bus.trigger('modal:show', false);
      }
    });
  }

  render() {
    return (
      <div className='eight-ex-pay'>
        <ModalLauncher buttonLabel={this.props.label || 'Pay with 8x'}>
          <MemoryRouter>
            <Container/>
          </MemoryRouter>
        </ModalLauncher>
      </div>

    );
  }
};

export default EightExPay;

