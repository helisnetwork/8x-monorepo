/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';

/* App component */
class Address extends React.Component {
  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="Success"/>
          <div className="hero">
            <div className="text">
              <h1>Congratulations!</h1>
              <h1>Your wallet has been created</h1>
              <p className="middle-text">Similar to a bank account number, your public wallet address will be what you share to recieve funds.</p>
            </div>
            <div className="address-item">
              <p>Your Personal Wallet Public Address</p>
              <div className="address-box">
                <p>0x3551466a812dD2e7Dc9323d246d208B7FDd3fe8D</p>
              </div>
            </div>
            <div className="end-text">
              <p>Please note. This wallet is an Ethereum Wallet, meaning it can hold Ether and ERC tokens.</p>
              <p className="warning">Please do not send Bitcoin, Litecoin or any other non-Ethereum based currencies to this address. If you do they will be lost forever.</p>
              <p className="proceed">Let’s deposit some funds into your new wallet and complete your subscription</p>
            </div>
          </div>
          <div className="cta-button">
            <p className="text">Continue</p>
          </div>   
        </div> 
      </div>
    );
  }
};

export default Address;
