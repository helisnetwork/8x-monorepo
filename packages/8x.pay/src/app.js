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

/* App component */
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      planHash: ''
    };

    let userStore = new UserStore();
    let subscriptionStore = new SubscriptionStore();

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit() {

    const planHash = this.state.planHash;
    console.log(planHash);
    bus.trigger('planhash:sent', planHash);

  };

  render() {
    return (
      <div>
        <form>
          <div className="planhash-input">
            <input
              id="planhash-input"
              name="planHash"
              type="text"
              value={this.state.planhash}
              placeholder="Please enter in the plan hash of the subscription you are subscribing to"
              onChange={this.handleInputChange}
            />
          </div>
        </form>
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

