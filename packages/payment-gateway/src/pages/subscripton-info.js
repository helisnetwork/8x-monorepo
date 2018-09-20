/* Import statements */
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { default as Images } from '../middleware/images';
import Dropdown from '../components/dropdown.js';
import Header from '../components/header.js';
import MetaMaskInstall from '../components/metamask-install.js';
import MetaMaskLocked from '../components/metamask-locked.js';
import { Link } from 'react-router-dom';
import bus from '../bus';

/* App component */
class SubscriptionInfo extends React.Component {

  constructor() {
    super(); 

    this.state = {
      copied: false,
      selectedCurrency: '',
      selectedPeriod: '',
      kyberConversion: '',
      logo: [],
      subscriptionName: '',
      subscriptionDetails: '',
      subscriptionAmount: '',
      subscriptionPeriod: '',

    };

    this.handleSelectedCurrency = this.handleSelectedCurrency.bind(this);
    this.handleSelectedPeriod = this.handleSelectedPeriod.bind(this);
    this.subscriptionPlanHandler = this.subscriptionPlanHandler.bind(this);

  }

  componentDidMount() {
    this.handleSelectedCurrency();
    this.handleSelectedPeriod();

    bus.on('subscription:plan:sent', this.subscriptionPlanHandler); 
    bus.trigger('subscription:plan:requested');
  }

  componentWillUnmount() {
    bus.off('subscription:plan:sent', this.subscriptionPlanHandler); 
  }

  subscriptionPlanHandler(object) {
    console.log(object);
    this.setState({
      logo: object.logo,
      subscriptionName: object.subscriptionName,
      subscriptionDetails: object.subscriptionDetails,
      subscriptionAmount: object.subscriptionAmount,
      subscriptionPeriod: object.subscriptionPeriod
    });
  };

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
        
        // Added a factor of 1% to account for slippage
        var currencyConversion = data.ETH_DAI.currentPrice * 1.01;
        let roundedNumber = currencyConversion.toFixed(6);
        

        this.setState({
          kyberConversion: roundedNumber
        });
      });
  };

  calculateSendAmount () {
    //this.getKyberInformation();
    if (this.state.selectedCurrency === 'Dai') {
      return this.state.selectedPeriod * this.state.subscriptionAmount;
    }
    else if (this.state.selectedCurrency === 'Ethereum') {
      return (this.state.selectedPeriod * this.state.kyberConversion * this.state.subscriptionAmount).toFixed(4);
    }

  }

  checkDaiSelected () {
    return this.state.selectedCurrency === 'Dai' ? true : false;
  }

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

  resetCopyState() {
    setTimeout(() => {
      this.setState({
        copied: false
      });
    }, 2000);
    
  };

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
                <img src={this.state.logo}/>
              </div>
              <div className="text">
                <p>{this.state.subscriptionName} -  {this.state.subscriptionDetails}</p>
                <span>${this.state.subscriptionAmount}USD billed {this.state.subscriptionPeriod}</span>
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
              <p className="text-address">{this.props.userAddress}</p>
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
              <p className="currency">{this.checkDaiSelected() ? this.props.daiBalance : this.props.ethBalance} {this.state.selectedCurrency}</p>
            </div>
            {
              this.checkDaiSelected() 
                ? 
                <div className="transaction">
                  <p onClick={this.props.payAction}>Begin Subscription</p>
                </div>
                : 
                <Link to='/conversion'>
                  <div className="transaction">
                    <p onClick={this.props.payAction}>Continue</p>
                  </div>
                </Link>
            }
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
};

export default SubscriptionInfo;
