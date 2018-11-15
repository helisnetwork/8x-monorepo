import React from 'react';
import Header from '../components/header';
import { default as Images } from '../middleware/images';
import { Link } from 'react-router-dom'; 
import Dropdown from '../components/dropdown';
import bus from '../bus';

class ConversionPrompt extends React.Component {

  constructor(props){
    super(props);
    
    this.state = {
      conversionPeriod: '',
      rate: ''
    };

    

    this.handleSelectedConversionPeriod = this.handleSelectedConversionPeriod.bind(this);
    this.handleKyberConversion = this.handleKyberConversion.bind(this);
    this.getExchangeRate = this.getExchangeRate.bind(this);
    this.returnMonthToSeconds = this.returnMonthToSeconds.bind(this);

  }

  componentDidMount() {
    this.getExchangeRate();
    bus.trigger('request:exchange:rate');
  }
  
  componentWillUnmount() {
    bus.off('exchange:rate:sent');
    bus.off('conversion:complete');
  }

  handleSelectedConversionPeriod(period) {
    bus.trigger('request:exchange:rate');
    this.setState({
      conversionPeriod: period
    });
  }

  getExchangeRate() {
    bus.on('exchange:rate:sent', (rate) => {
      this.setState({
        rate: rate
      })
    })
  }

  showExpectedConversionAmount() {
    bus.on('exchange:rate:sent', (rate) => {
      if(this.state.rate === '' || this.state.rate != rate) {

      }
    });
    
  

  }

  returnMonthToSeconds() {
    switch(this.state.conversionPeriod) {
      case '1 month':
      return 30 * 24 * 60 * 60; 
      break; 
      case '3 months':
      return 3 * 30 * 24 * 60 * 60; 
      break;
      case '6 months':
      return 6 * 30 * 24 * 60 * 60;
      break;
      case '9 months':
      return 9 * 30 * 24 * 60 * 60;
      break;
    }
  }

  handleKyberConversion() {
    bus.on('conversion:complete', () => {
      
    });

    bus.trigger('conversion:requested', this.returnMonthToSeconds());

  }

  conversionPeriod() {
    return [
      {
        name: "1 month"
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
              <h2>0.014 ETH</h2>
            </div>
            <div className="arrow">
              <img className="arrow" src={Images.arrow}/>
            </div>
            <div className="dai">
              <img className="logo" src={Images.daiLogo}/>
              <p>Receive</p>
              <h2>240 DAI</h2>
            </div>
          </div>
          <div className="secondary-text">
            <p className="title">1 ETH = {this.state.rate} DAI</p>
          </div>
        </div>
        {/* <Link to='/begin-subscription'> */}
          <div className="button" onClick={() => {this.handleKyberConversion();}}>
            <p className="convert">Convert</p>
          </div>
          <div className="skip-text">
            <u className="skip">Skip this step</u>
          </div>
          
        {/* </Link> */}
      </div>
    );
  }
};

export default ConversionPrompt;