/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

/* App component */
class SelectWallet extends React.Component {
  render() {
    return (
      <div className="main-card">
        <div className="card-header">
          <p>Where are your funds stored?</p>
          <p>Please select an option</p>
        </div>
        <div className="option-container">
          <div className="metamask-container">
            <div className="metamaskLogo">
              <img src={Images.metamaskLogo}/>
            </div>
            <div className="metamaskText">
              <p>Metamask</p>
              <p>MetaMask is a browser extension that allows you to store Ether and interact with decentralised apps.</p>
            </div>
          </div>
          <div className="ledger-container">
            <div className="ledgerLogo">
              <img src={Images.ledgerLogo}/>
            </div>
            <div className="ledger-text">
              <p>Ledger</p>
              <p>You store your cryptocurrency on a Ledger Hardware Wallet.</p>
            </div>
          </div>
          <div className="trezor-container">
            <div className="trezorLogo">
              <img src={Images.trezorLogo}/>
            </div>
            <div className="trezor-text">
              <p>Trezor</p>
              <p>You store your cryptocurrency on a Trezor Hardware Wallet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SelectWallet;
