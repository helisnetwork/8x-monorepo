import React from 'react';
import styled from 'styled-components';

import SelectWallet from '../pages/select-wallet';
import MetamaskHandler from '../pages/metamask-handler';
import ConversionPrompt from '../pages/conversion-prompt';

import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';

import { 
  TransitionGroup,
  CSSTransition 
} from 'react-transition-group';



function Container({ location }) {
  return (
    <Wrapper> 
      <TransitionGroup className="transition-group">
        <CSSTransition
          key={location.key}
          timeout={{ enter: 200, exit: 200 }}
          classNames={'fade'}
        >
          <section className="route-section">
            <Switch location = { location }>
              <Route exact path="/" component={SelectWallet}/>
              <Route path="/metamask-handler" component={MetamaskHandler}/>
              <Route path="/conversion" component={ConversionPrompt}/>
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  div.transition-group {
    
  }
  section.route-section {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
  .fade-enter {
    opacity: 0.01;
  }
  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
  }
  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }
`;

export default withRouter(Container);