/* Import statements */
import React from 'react';
import './assets/stylesheets/app.scss';
import { MemoryRouter } from 'react-router-dom';
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

