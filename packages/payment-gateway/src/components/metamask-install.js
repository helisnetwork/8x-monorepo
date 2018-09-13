/* Import statements */
import React from 'react';
import {default as Images} from '../middleware/images';
import Header from './header';

/* App component */
class MetaMaskInstall extends React.Component {
  constructor() {
    super();
  };

  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="MetaMask Not Installed" previousPage="/"/>
          <div className="prompt">
            <h2 className="install">8x Payment Gateway cannot detect MetaMask on your browser</h2>
            <img src={Images.metamaskLogo} className="logo"/>
            <p className="text">Please make sure the MetaMask plugin is installed on this browser.</p> 
            <a href="https://www.metamask.io" className="button">
              <p className="metamask-download">Download MetaMask</p>
            </a>
          </div>
        </div> 
      </div>
    );
  }
}

export default MetaMaskInstall;