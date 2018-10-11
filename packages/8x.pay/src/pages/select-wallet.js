/* Import statements */
import React from 'react';

import { Link } from 'react-router-dom'; 
import {default as Images} from '../middleware/images';

/* App component */
class SelectWallet extends React.Component {

  render() {
    return (
      <div className="background">
        <div className="small-card">
          <div className="main-card">
            <div className="card-header">
              <h1>Where are your funds stored?</h1>
              <p>Please select an option</p>
            </div>
            <div className="options-container">
              <Link to='/metamask-handler'> 
                <div className="item metamask">
                  <div className="logo">
                    <img src={Images.metamaskLogo}/>
                  </div>
                  <div className="text">
                    <h2>MetaMask</h2>
                    <p>MetaMask is a browser extension that allows you to store Ether and interact with decentralised apps.</p>
                  </div>
                </div>
              </Link>
              <Link to='/ledger-handler'>
              <div className="item ledger">
                <div className="logo">
                  <img src={Images.ledgerLogo}/>
                </div>
                <div className="text">
                  <h2>Ledger</h2>
                  <p>Coming soon...</p>
                </div>
              </div>
              </Link>
              {/*<Link to='/trezor-handler'>*/}
              <div className="item trezor">
                <div className="logo">
                  <img src={Images.trezorLogo}/>
                </div>
                <div className="text">
                  <h2>Trezor</h2>
                  <p>Coming soon...</p>
                </div>
              </div>
              {/*</Link>*/}
              {/*<a className="item exchange">
                <div className="logo">
                  <img src={Images.trezorLogo}/>
                </div>
                <div className="text">
                  <h2>Exchange</h2>
                  <p>You store your cryptocurrency on an exchange, such as Binance or Coinbase.</p>
                </div>
                </a>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SelectWallet;
