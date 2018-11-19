/* Import statements */
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { default as Images } from '../middleware/images';
import Dropdown from '../components/dropdown.js';
import Header from '../components/header.js';
import MetaMaskInstall from '../components/metamask-install.js';
import MetaMaskLocked from '../components/metamask-locked.js';
import MetaMaskNetwork from '../components/metamask-network.js';
import { Link, Redirect } from 'react-router-dom';
import bus from '../bus';
import { PropagateLoader } from 'react-spinners';

/* App component */
class SubscriptionInfo extends React.Component {

  constructor() {
    super();

    this.state = {
      copied: false,
      selectedCurrency: '',
      selectedPeriod: '',
      logo: [],
      subscriptionName: '',
      subscriptionDetails: '',
      subscriptionAmount: '',
      subscriptionPeriod: '',
      subscribe: false,
      paymentStatus: '',
      address: '',
      daiBalance: '',

    };

    this.handleSelectedCurrency = this.handleSelectedCurrency.bind(this);
    this.handleSelectedPeriod = this.handleSelectedPeriod.bind(this);
    this.subscriptionPlanHandler = this.subscriptionPlanHandler.bind(this);
    this.loadingStateListener = this.loadingStateListener.bind(this);
    this.subscribeComplete = this.subscribeComplete.bind(this);
    this.userInfoListener = this.userInfoListener.bind(this);
    this.checkUserActivity = this.checkUserActivity.bind(this);

  }

  componentDidMount() {
    this.userInfoListener();
    this.initializeDropdownItems();
    this.loadingStateListener();
    this.checkUserActivity();
    bus.on('subscription:plan:sent', this.subscriptionPlanHandler);
    bus.trigger('subscription:plan:requested', 'subscription-plan-render');
    bus.on('loading:state', this.loadingStateListener());
  }

  componentWillUnmount() {
    clearInterval(this.unlockInterval);
    bus.off('subscription:plan:sent', this.subscriptionPlanHandler);
    bus.off('loading:state', this.loadingStateListener());
    bus.off('user:address:sent'); 
    bus.off('ERC20:balance:sent');
    bus.off('subscription:process:failed');
    bus.off('user:subscribe:completed');
    bus.off('loading:state');
  }


  checkUserActivity() {
    this.unlockInterval = setInterval(() => {   
      bus.trigger('user:get:account:info', ('requestedUpdate'));
    }, 2000);
  }

  initializeDropdownItems() {
    const currencyItems = this.dropdownItems();
    const timeItems = this.timeItems(); 

    this.handleSelectedCurrency(currencyItems[0].name);
    this.handleSelectedPeriod(timeItems[0].name);

  }

  userInfoListener() {
    bus.on('user:address:sent', (address) => {
      this.setState({
        address: address
      })
    });

    bus.trigger('user:address:requested');

    bus.on('ERC20:balance:sent', (bal) => {
      this.setState({
        daiBalance: bal
      })
    });

    bus.trigger('ERC20:balance:requested');
  }

  subscriptionPlanHandler(object) {
    this.setState({
      logo: object.logo,
      subscriptionName: object.subscriptionName,
      subscriptionDetails: object.subscriptionDetails,
      subscriptionAmount: object.subscriptionAmount,
      subscriptionPeriod: object.subscriptionPeriod
    });
  };

  handleSubscribe() {
    bus.on('subscription:process:failed', () => {
      this.setState({
        paymentStatus: 'authorized'
      });
    });
    
    bus.on('user:subscribe:completed', (hash) => {
      this.setState({
        subscribe: true,
        paymentStatus: 'subscribed'
      });
      console.log('Subscription Hash is:' + '' + hash );
    });

    bus.trigger('user:subscribe:requested');
  }

  subscribeComplete() {
    bus.trigger('modal:show', false);
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

  calculateSendAmount () {
    if (this.state.selectedCurrency === 'Dai') {
      return (parseFloat(this.state.selectedPeriod) * parseFloat(this.state.subscriptionAmount)).toFixed(4);
    }
  }

  dropdownItems() {
    return [
      {
        image: Images.daiLogo,
        name: 'Dai',
        ticker: 'DAI'
      }
    ];
  }

  timeItems(){
    return [
      {
        name: '3',
        ticker: this.humanizeDuration(this.state.subscriptionPeriod)
      },
      {
        name: '6',
        ticker: this.humanizeDuration(this.state.subscriptionPeriod)
      },
      {
        name:'9',
        ticker: this.humanizeDuration(this.state.subscriptionPeriod)
      }
    ];
  }

  resetCopyState() {
    setTimeout(() => {
      if (this.state.copied == true) {
        this.setState({
          copied: false
        });
        return;
      }
    }, 2000);
  };

  humanizeDuration(timeInSeconds) {
    var result = '';
    if (timeInSeconds) {
      if ((result = Math.round(timeInSeconds / (60 * 60 * 24 * 30 * 12))) > 0) { //years
        result = result === 1 ? ' year' : result + ' years';
      } else if ((result = Math.round(timeInSeconds / (60 * 60 * 24 * 30))) > 0) { //months
        result = result === 1 ? ' month' : result + ' months';
      } else if ((result = Math.round(timeInSeconds / (60 * 60 * 24 * 7))) > 0) { //months
        result = result === 1 ? ' week' : result + ' weeks';
      } else if ((result = Math.round(timeInSeconds / (60 * 60 * 24))) > 0) { //days
        result = result === 1 ? ' day' : result + ' days';
      } else if ((result = Math.round(timeInSeconds / (60 * 60))) > 0) { //hours
        result = result === 1 ? ' hours' : result + ' hours';
      } else if ((result = Math.round(timeInSeconds / (60))) > 0) { //minutes
        result = result === 1 ? ' minute' : result + ' minutes';
      } else if ((result = Math.round(timeInSeconds)) > 0) { //seconds
        result = result === 1 ? ' second' : result + ' seconds';
      } else {
        result = 'unknown';
      }
    }
    return result;
  }

  loadingStateListener() {
    bus.on('loading:state', () => {
      this.setState({
      paymentStatus: 'loading'
    });
    });
  }

  returnPayButtonState() {

    const subscribe = (
      <div className='subscribe' 
        onClick={() => {
        this.handleSubscribe();
      }}>
        <p>Subscribe</p>
      </div>
    );

    const subscribeComplete = (
      <div className='activate' 
        onClick={() => {
        this.subscribeComplete();
      }}>
        <p>Successfully subscribed</p>
      </div>
    );

    const loading = (
      <div className='loading'>
        <PropagateLoader
          className='subscription-loading'
          color={'white'}
        />
      </div>
    );

    if (!this.state.subscribe && this.state.paymentStatus !== 'loading') {
      return subscribe;
    }

    switch (this.state.paymentStatus) {
      case 'subscribed':
        return subscribeComplete;
      case 'loading':
        return loading;
      case 'authorized':
        return subscribe;
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
    case 'wrong network':
      return this.renderWrongNetwork();
      break;
    default: 
      return null;
    }
  }

  renderUnlocked() {

    let shouldFlex = 1;
    if (this.state.logo) {
      shouldFlex = 0;
    }

    return (
      <div className='background-subs'>
        <div className='small-card'>
          <Header title='Subscription Information' previousPage='/'/>
          <div className='hero'>
            <div className='main-item'>
              { this.state.logo ? (<div className='logo'>
                <img src={this.state.logo}/>
              </div>
              ) : null }
              <div className='text' style={{ flex: `${shouldFlex}`}}>
                <p>{this.state.subscriptionName} -  {this.state.subscriptionDetails}</p>
                <span>${this.state.subscriptionAmount}USD billed every {this.humanizeDuration(this.state.subscriptionPeriod)}</span>
              </div>
            </div>
            <div className='option'>
              <div className='currency'>
                <div className='text'>
                  <p>I want to pay using</p>
                </div>
                <Dropdown items={this.dropdownItems()} onSelectedItem={this.handleSelectedCurrency}/>
              </div>
              <div className='time'>
                <div className='text'>
                  <p>I want to top my account every</p>
                </div>
                <Dropdown items={this.timeItems()} onSelectedItem={this.handleSelectedPeriod}/>
              </div>
            </div>
            <div className='action'>
              <p className='text'>To start your subscription, please send</p>
              <h2>{this.calculateSendAmount()} {this.state.selectedCurrency}</h2>
              <p className='text'>to your personal wallet</p>
            </div>
            <div className='item-address'>
              <p className='text-address'>{this.state.address}</p>
              <CopyToClipboard
                text={this.state.address}
                onCopy={() => {
                  this.setState({copied: true});
                  this.resetCopyState();
                }}
              >
                <div className='text-button'>
                  {
                    this.state.copied
                      ? <p className='text-copy'>Copied</p>
                      :<p className='text-copy'>Copy</p>
                  }
                </div>
              </CopyToClipboard>
            </div>
            <div className='balance'>
              <p>Current Balance</p>
              <p className='currency'>{this.state.daiBalance} {this.state.selectedCurrency}</p>
            </div>
            { this.returnPayButtonState() }
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

  renderWrongNetwork() {
    return (
      <MetaMaskNetwork/>
    )
  }

};

export default SubscriptionInfo;
