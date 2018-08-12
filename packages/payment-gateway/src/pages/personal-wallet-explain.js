/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';

/* App component */
class PersonalWalletExplain extends React.Component {
  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="Setup a Personal Wallet"/>
          <div className="hero">
            <div className="icon">
              <img src={Images.walletImage}/>
            </div>
            <div className="text">
              <h1>What is a Personal Wallet?</h1>
              <p className="middle-text">A personal wallet is an Ethereum Wallet, that you have full control and responsibility of. By creating a personal wallet, you will receive both its public address, and private keys.</p>
              <h2>Learn More about Personal Wallets</h2>
            </div>
          </div>
          <div className="cta-button">
            <p className="text">Next</p>
          </div>   
        </div> 
      </div>
    );
  }
};

export default PersonalWalletExplain;
