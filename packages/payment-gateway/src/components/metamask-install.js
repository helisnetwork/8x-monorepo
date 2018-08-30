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
          <div className="hero">
            <p className="install">8x cannot detect MetaMask on your browser</p>
            <a href="www.metamask.io">
              <img className="metamask-download" src={Images.downloadMetaMask}/>
            </a>
          </div>
        </div> 
      </div>
    );
  }
}

export default MetaMaskInstall;