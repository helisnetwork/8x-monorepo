/* Import statements */
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { default as Images } from '../middleware/images';
import Dropdown from '../components/dropdown.js';
import Header from '../components/header.js';
import MetaMaskInstall from '../components/metamask-install.js';
import MetaMaskLocked from '../components/metamask-locked.js';

/* App component */
class SubscriptionInfo extends React.Component {

  constructor() {
    super(); 

    this.state = {
      value: '',
      copied: false,
      currency: 'DAI'
    };

  }

  // Conditions on which page to render depending on status provided by handlers
  render() {
    switch(this.props.status)  {
    case 'unlocked':
      return this.renderUnlocked();
      break;
    case 'locked':
      return this.renderLocked();
      break; 
    case 'not installed':
      return this.renderInstallPrompt();
      break;
    case 'loading':
      return this.renderLoading();
      break;
    default: 
      return this.renderError();
    }
  }

  renderUnlocked() {
    return (
      <div className="background">
        <div className="small-card">
          <Header title="Subscription Information" previousPage="/"/>
          <div className="hero">
            <div className="main-item">
              <div className="logo">
                <img src={Images.netflixLogo}/>
              </div>
              <div className="text">
                <p>Netflix - Premium Account</p>
                <span>$14USD billed monthly</span>
              </div>
            </div>
            <div className="option">
              <div className="currency">
                <div className="text">
                  <p>I want to pay using</p>
                </div>
                <Dropdown items={this.dropdownItems()}/>
              </div>
              <div className="time">
                <div className="text">
                  <p>I want to top my account every</p>
                </div>
                <Dropdown items={this.timeItems()}/>
              </div>
            </div>
            <div className="action">
              <p className="text">To start your subscription, please send</p>
              <h2>{this.props.kyberConversion} {this.state.currency}</h2>
              <p className="text">to your personal wallet</p>
            </div>
            <div className="item-address">
              <p className="text-address">{this.props.useraddress}</p>
              <CopyToClipboard 
                text={this.props.useraddress} 
                onCopy={() => {
                  this.resetCopyState();
                  this.setState({copied: true});
                }}
              >
                <div className="text-button">
                  {
                    this.state.copied
                      ? <p className="text-copy">Copied</p>
                      :<p className="text-copy">Copy</p> 
                  }
                </div>
              </CopyToClipboard>
            </div>
            <div className="balance">
              <p>Current Balance</p>
              <p className="currency">{this.props.balance} {this.state.currency}</p>
            </div>
            <div className="transaction">
              <p onClick={this.props.payAction}>Pay</p>
            </div>
          </div>
        </div> 
      </div>
    );
  }

  renderLocked() {
    return (
      <MetaMaskLocked/>
    );
  }

  renderInstallPrompt() {
    return (
      <MetaMaskInstall/>
    );
  }

  // @TODO: Add a page for loading trezor and ledger screens
  renderLoading() {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  resetCopyState() {
    setTimeout(() => {
      this.setState({
        copied: false
      });
    }, 2000);
    
  };

  dropdownItems() {
    return [
      {
        image: Images.daiLogo,
        name: 'Dai',
        ticker: 'DAI'
      },
      {
        image: Images.ethLogo,
        name: 'Ethereum',
        ticker: 'ETH'
      }
    ];
  }

  timeItems(){
    return [
      {
        name: '3',
        ticker: 'months'
      },
      {
        name: '6',
        ticker: 'months'
      },
      {
        name:'9',
        ticker: 'months'
      }
    ];
  }
};

export default SubscriptionInfo;
