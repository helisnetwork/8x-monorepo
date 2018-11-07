import React from 'react';
import Header from '../components/header';
import { default as Images } from '../middleware/images';
import { Link } from 'react-router-dom'; 
import Dropdown from '../components/dropdown';

class ConversionPrompt extends React.Component {

  constructor(props){
    super(props);
    
    this.state = {
      conversionPeriod: ''
    };

    this.handleSelectedConversionPeriod = this.handleSelectedConversionPeriod.bind(this);

  }

  handleSelectedConversionPeriod(period) {
    this.setState({
      conversionPeriod: period
    });
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
            <p className="title">1 ETH = 203.00 DAI</p>
          </div>
        </div>
        <Link to='/begin-subscription'>
          <div className="button">
            <p className="convert">Convert</p>
          </div>
        </Link>
      </div>
    );
  }
};

export default ConversionPrompt;