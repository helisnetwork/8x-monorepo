/*Import statements*/
import React from 'react';
import Header from './header';
import { default as Images } from '../middleware/images';

import bus from '../bus';


class MetaMaskLocked extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      locked: true
    }

  }

  componentDidMount() {
    this.checkUnlock();
  }

  componentWillUnmount() {
    clearInterval(this.unlockInterval);
  }

  checkUnlock() {
    this.unlockInterval = setInterval(() => {   
      bus.trigger('user:get:account:info', ('requestedUpdate'));
    }, 1000);
  }


  render () {
    return (
      <div className="background">
        <div className="small-card">
          <Header title="MetaMask Locked" previousPage="/"/>
          <div className="locked-container">
            <img className="graphic" src={Images.metamaskLocked}/>
            <p className="locked-text">Unlock MetaMask to interact with 8x.Pay and complete your subscription</p>
          </div>
        </div> 
      </div>
    );
  }
}

export default MetaMaskLocked; 