/*Import statements*/
import React from 'react';
import Header from './header';
import { default as Images } from '../middleware/images';

import bus from '../bus';


class MetaMaskNetwork extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      locked: true
    }

  }


  render () {
    return (
      <div className="background">
        <div className="small-card">
          <Header title="MetaMask Locked" previousPage="/"/>
          <div className="locked-container">
            <img className="graphic" src={Images.metamaskNetwork}/>
            <p className="locked-text">Unlock MetaMask to interact with 8x.Pay and complete your subscription</p>
          </div>
        </div> 
      </div>
    );
  }
}

export default MetaMaskLocked; 