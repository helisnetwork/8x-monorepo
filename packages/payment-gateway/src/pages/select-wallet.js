/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

/* App component */
class SelectWallet extends React.Component {
  render() {
    return (
      <div>
        <div className="main-card">
          <div className="card-header">
            <p>Where are your funds stored?</p>
            <p>Please select an option</p>
          </div>
          <div className="options-container">
            <div className="item metamask">
              <div className="logo">
                <img src={Images.metamaskLogo}/>
              </div>
              <div className="text">
                <p>Metamask</p>
                <p>MetaMask is a browser extension that allows you to store Ether and interact with decentralised apps.</p>
              </div>
            </div>
            <div className="item ledger">
              <div className="logo">
                <img src={Images.ledgerLogo}/>
              </div>
              <div className="text">
                <p>Ledger</p>
                <p>You store your cryptocurrency on a Ledger Hardware Wallet.</p>
              </div>
            </div>
            <div className="item trezor">
              <div className="logo">
                <img src={Images.trezorLogo}/>
              </div>
              <div className="text">
                <p>Trezor</p>
                <p>You store your cryptocurrency on a Trezor Hardware Wallet.</p>
              </div>
            </div>
            <div className="item exchange">
              <div className="logo">
                <img src={Images.trezorLogo}/>
              </div>
              <div className="text">
                <p>Exchange</p>
                <p>You store your cryptocurrency on an exchange, such as Binance or Coinbase.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SelectWallet;
