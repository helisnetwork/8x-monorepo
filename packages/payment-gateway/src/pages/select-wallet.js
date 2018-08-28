/* Import statements */
import React from 'react';
import TrezorConnect from 'trezor-connect';

import {default as Images} from '../middleware/images';

/* App component */
class SelectWallet extends React.Component {
  render() {
    return (
      <div className="small-card">
        <div className="main-card">
          <div className="card-header">
            <h1>Where are your funds stored?</h1>
            <p>Please select an option</p>
          </div>
          <div className="options-container">
            <a className="item metamask" href="www.8xprotocol.com/metamask">
              <div className="logo">
                <img src={Images.metamaskLogo}/>
              </div>
              <div className="text">
                <p>Metamask</p>
                <p>MetaMask is a browser extension that allows you to store Ether and interact with decentralised apps.</p>
              </div>
            </a>
            <a className="item ledger" href="www.8xprotocol.com/ledger">
              <div className="logo">
                <img src={Images.ledgerLogo}/>
              </div>
              <div className="text">
                <p>Ledger</p>
                <p>You store your cryptocurrency on a Ledger Hardware Wallet.</p>
              </div>
            </a>
            <a className="item trezor" href="www.8xprotocol.com/trezor">
              <div className="logo">
                <img src={Images.trezorLogo}/>
              </div>
              <div className="text">
                <p>Trezor</p>
                <p>You store your cryptocurrency on a Trezor Hardware Wallet.</p>
              </div>
            </a>
            <a className="item exchange">
              <div className="logo">
                <img src={Images.trezorLogo}/>
              </div>
              <div className="text">
                <p>Exchange</p>
                <p>You store your cryptocurrency on an exchange, such as Binance or Coinbase.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
};

export default SelectWallet;
