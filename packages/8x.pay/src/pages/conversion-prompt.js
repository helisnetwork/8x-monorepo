import React from 'react';
import { default as Images } from '../middleware/images';
import Dropdown from '../components/dropdown';
import bus from '../bus';
import SubscriptionInfo from './subscripton-info';

class ConversionPrompt extends React.Component {

  constructor(props){
    super(props);
    
    this.state = {
      conversionPeriod: '1 month',
      conversionCompleted: false,
      rate: '',
      ethRate: '',
      daiRate: '',
      skipConversion: false
    };

    this.handleSelectedConversionPeriod = this.handleSelectedConversionPeriod.bind(this);
    this.handleKyberConversion = this.handleKyberConversion.bind(this);
    this.getExchangeRate = this.getExchangeRate.bind(this);
    this.returnMonthToSeconds = this.returnMonthToSeconds.bind(this);
    this.showEthAmount = this.showEthAmount.bind(this);
    this.showDaiAmount = this.showDaiAmount.bind(this);
    this.initializeDropdownItems = this.initializeDropdownItems.bind(this);
    this.handleCorrectDaiRate = this.handleCorrectDaiRate.bind(this);
    this.handleCorrectEthRate = this.handleCorrectEthRate.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
  }

  componentDidMount() {
    this.getExchangeRate();
    this.initializeDropdownItems();
    bus.trigger('request:exchange:rate');
    this.showEthAmount();
    this.showDaiAmount();
    bus.trigger('display:rates:requested',this.returnMonthToSeconds());
  }
  
  componentWillUnmount() {
    bus.off('exchange:rate:sent');
    bus.off('conversion:complete');
    bus.off('display:rate:eth:sent');
    bus.off('display:rate:dai:sent');
  }

  initializeDropdownItems() {
    const periodItem = this.conversionPeriod();
    this.handleSelectedConversionPeriod(periodItem[0].name);
  }

  handleSelectedConversionPeriod(period) {
    this.setState({
      conversionPeriod: period
    });
  }

  handleSkip() {
    this.setState({
      skipConversion: true
    });
  }

  getExchangeRate() {
    bus.on('exchange:rate:sent', (rate) => {
      this.setState({
        rate: rate
      })
    })
  }

  showDaiAmount() {
    bus.on('display:rates:dai:sent', (dai) => {
      this.setState({
        daiRate: dai
      });
    });
  }

  showEthAmount() {
    bus.on('display:rates:eth:sent', (eth) => {
      this.setState({
        ethRate: eth
      });
    });
  }

  handleCorrectDaiRate() {
    const daiRate = this.state.daiRate;
    const dai = parseFloat(daiRate)
    let result = dai;
    switch(this.state.conversionPeriod) {
      case '1 month':
      result = dai;
      break;
      case '3 months':
      result = dai * 3;
      break;
      case '6 months':
      result =  dai * 6;
      break;
      case '9 months':
      result = dai * 9;
    } 
    return (result).toFixed(2);
  }

  handleCorrectEthRate() {
    const ethRate = this.state.ethRate;
    const eth = parseFloat(ethRate);
    let result = eth;
    switch(this.state.conversionPeriod) {
      case '1 month':
      result = eth;
      break;
      case '3 months':
      result = eth * 3;
      break;
      case '6 months':
      result = eth * 6;
      break;
      case '9 months':
      result = eth * 9;
    } 
    return result.toFixed(4);
  }

  returnMonthToSeconds() {
    const monthToSeconds = 30 * 24 * 60 * 60; 
    switch(this.state.conversionPeriod) {
      case '1 month':
      return monthToSeconds;
      break; 
      case '3 months':
      return 3 * monthToSeconds;
      break;
      case '6 months':
      return 6 * monthToSeconds;
      break;
      case '9 months':
      return 9 * monthToSeconds;
      break;
    }
  }

  handleKyberConversion() {
    bus.on('conversion:complete', (confirmationReceipt) => {
      console.log('coversion:complete');
      this.setState({
        conversionCompleted: true
      });
      alert(confirmationReceipt);
    });

    console.log('trigger');
    bus.trigger('conversion:requested', this.returnMonthToSeconds());
  }

  conversionPeriod() {
    return [
      {
        name: "1 month",
      },
      {
        name: "3 months"
      },
      {
        name: "6 months"
      },
      {
        name: "9 months"
      }
    ];
  }

  render(){
    if(this.state.conversionCompleted === false) {
      if(this.state.skipConversion === false) {
        return (
          <div className="small-card">
            <div className="main-content">
              <div className="main-text">
                <h1 id="message">Conversion</h1>
                <p id="sub-message">To fund your future payments, we can convert your Ethereum into Dai. Converting your Dai now will eliminate the need for you to manually top up every month and avoid cancellation.</p>
              </div>
              <div className="conversion-dropdown">
                <p id="dropdown-text">Convert enough Dai for</p>
                <Dropdown items={this.conversionPeriod()} onSelectedItem={this.handleSelectedConversionPeriod}/>
              </div>
              <div className="main-graphics">
                <div className="ethereum">
                  <img className="logo" src={Images.ethLogo}/>
                  <p>Send</p>
                  <h2>{this.handleCorrectEthRate()} ETH</h2>
                </div>
                <div className="arrow">
                  <img className="arrow" src={Images.arrow}/>
                </div>
                <div className="dai">
                  <img className="logo" src={Images.daiLogo}/>
                  <p>Receive</p>
                  <h2>{this.handleCorrectDaiRate()} DAI</h2>
                </div>
              </div>
              <div className="secondary-text">
                <p className="title">1 ETH = {this.state.rate} DAI</p>
              </div>
            </div>
              <div className="button">
                <p className="convert" onClick={() => {this.handleKyberConversion()}}>Convert</p>
              </div>
              <div className="skip-text">
                <u className="skip" onClick={() => {this.handleSkip()}}>Skip this step</u>
              </div>
          </div>
        );
      } else {
        return <SubscriptionInfo status="unlocked"/>
      }
    } else if (this.state.conversionCompleted === true) {
      return (
        <SubscriptionInfo
          status='unlocked'
        />
      );
    } else {
      return null;
    }
  }
};

export default ConversionPrompt;