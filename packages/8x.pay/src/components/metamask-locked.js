/*Import statements*/
import React from 'react';
import Header from './header';
import { default as Images } from '../middleware/images';


class MetaMaskLocked extends React.Component {
  constructor() {
    super();
  }

  render () {
    return (
      <div className="background">
        <div className="small-card">
          <Header title="MetaMask Locked" previousPage="/"/>
          <div className="locked-container">
            <h2 className="locked-title">Please unlock your MetaMask</h2>
            <img className="graphic" src={Images.metamaskLogo}/>
            <p className="locked-text">Login and select your MetaMask account to proceed to payment page</p>
          </div>
        </div> 
      </div>
    );
  }
}

export default MetaMaskLocked; 