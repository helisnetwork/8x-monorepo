/* Import statements */
import React from 'react';
import './assets/stylesheets/app.scss';
import { MemoryRouter } from 'react-router-dom';
import {
  TransitionGroup,
  CSSTransition
} from 'react-transition-group';

import Container from './components/container';
import SimpleModalLauncher from './components/modal-launcher';
import UserStore from './store/user';
import SubscriptionStore from './store/subscription';

import bus from './bus';

/* App component */
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      planHash: ''
    };

    let userStore = new UserStore();
    let subscriptionStore = new SubscriptionStore();

    this.handleInputChange = this.handleInputChange.bind(this);

    console.log(`plan triggered: ${props.planHash}`);
    bus.trigger('planhash:sent', props.planHash);

    bus.on('user:activate:completed', (subscriptionHash, status) => {
      this.refs.form.getDOMNode().dispatchEvent(new Event('submit'));
    });

    this.refs.form.getDOMNode().dispatchEvent(new Event('submit'));
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    bus.trigger('planhash:sent', value);

  };


  render() {
    return (
      <div>
        <SimpleModalLauncher buttonLabel='Pay with 8x'>
          <MemoryRouter>
            <Container/>
          </MemoryRouter>
        </SimpleModalLauncher>
      </div>

    );
  }
};

export default App;

