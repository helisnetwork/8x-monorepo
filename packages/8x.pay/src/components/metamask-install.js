/* Import statements */
import React from 'react';
import {default as Images} from '../middleware/images';
import Header from './header';

/* App component */
class MetaMaskInstall extends React.Component {
  constructor() {
    super();
    
    this.openInNewTab = this.openInNewTab.bind(this);

  };


  openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="MetaMask Not Installed" previousPage="/"/>
          <div className="prompt">
            <img src={Images.metamaskLogo} className="logo"/>
            <p className="text">Please make sure the MetaMask plugin is installed on this browser.</p>
            <a href="https://www.metamask.io" target="_blank" rel="noopener noreferrer" className="button" onClick={() => {this.openInNewTab('https://www.metamask.io')}}>
              <p className="metamask-download">Download MetaMask</p>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default MetaMaskInstall;