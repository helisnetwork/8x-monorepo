/* Import statements */
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { default as Images } from '../middleware/images';
import Dropdown from '../components/dropdown.js';
import Header from '../components/header.js';
import MetaMaskInstall from '../components/metamask-install.js';
import MetaMaskLocked from '../components/metamask-locked.js';
import { Link } from 'react-router-dom';

/* App component */
class SubscriptionInfo extends React.Component {

  constructor() {
    super(); 

    this.state = {
      copied: false,
      selectedCurrency: '',
      selectedPeriod: 3,
      kyberConversion: '',
      subscriptionPrice: 14
    };

    this.handleSelectedCurrency = this.handleSelectedCurrency.bind(this);
    this.handleSelectedPeriod = this.handleSelectedPeriod.bind(this);

  }

  componentDidMount() {
    this.handleSelectedCurrency();
    this.handleSelectedPeriod();
  }

  // Gets data from selected currency of user
  handleSelectedCurrency(currency) {
    this.setState({
      selectedCurrency: currency
    });
  }

  // Gets data from selected time period of user
  handleSelectedPeriod(period) {
    this.setState({
      selectedPeriod: period
    });
  }

  // Uses Kyber API to get conversion rates
  getKyberInformation() {
    fetch('https://tracker.kyber.network/api/tokens/pairs')
      .then(results => {
        return results.json();
      }).then(data => {
        console.log(data.ETH_DAI.currentPrice);
        var currencyConversion = data.ETH_DAI.currentPrice;
        this.setState({
          kyberConversion: currencyConversion
        });
      });
  };

  calculateSendAmount () {
    if (this.state.selectedCurrency === 'Dai') {
      return this.state.selectedPeriod * this.state.subscriptionPrice;
    }
    else if (this.state.selectedCurrency === 'Ethereum') {
      return this.state.selectedPeriod * this.state.kyberConversion;
    }

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
      <div className="background-subs">
        <div className="small-card">
          <Header title="Subscription Information" previousPage="/"/>
          <div className="hero">
            <div className="main-item">
              <div className="logo">
                <img src={Images.netflixLogo}/>
              </div>
              <div className="text">
                <p>Netflix - Premium Account</p>
                <span>${this.state.subscriptionPrice}USD billed monthly</span>
              </div>
            </div>
            <div className="option">
              <div className="currency">
                <div className="text">
                  <p>I want to pay using</p>
                </div>
                <Dropdown items={this.dropdownItems()} onSelectedItem={this.handleSelectedCurrency}/>
              </div>
              <div className="time">
                <div className="text">
                  <p>I want to top my account every</p>
                </div>
                <Dropdown items={this.timeItems()} onSelectedItem={this.handleSelectedPeriod}/>
              </div>
            </div>
            <div className="action">
              <p className="text">To start your subscription, please send</p>
              <h2>{this.calculateSendAmount()} {this.state.selectedCurrency}</h2>
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
              <p className="currency">{this.props.balance} {this.state.selectedCurrency}</p>
            </div>
            <Link to='/pay'>
              <div className="transaction">
                <p onClick={this.props.payAction}>Pay</p>
              </div>
            </Link>
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
