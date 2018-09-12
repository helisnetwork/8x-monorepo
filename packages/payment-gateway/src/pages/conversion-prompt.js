import React from 'react';
import Header from '../components/header';
import { default as Images } from '../middleware/images';

class ConversionPrompt extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (
      <div className="small-card">
        <Header title="Convert to Dai" previousPage="/metamask-handler"/>
        <div className="main-content">
          <div className="main-text">
            <h2 id="message">Once you begin your subscription, your Ethereum will be converted into Dai.</h2>
          </div>
          <div className="main-graphics">
            <div className="ethereum">
              <img className="logo" src={Images.ethLogo}/>
              <h2>0.014</h2>
              <p>ETH</p>
            </div>
            <div className="arrow">
              <img className="logo" src={Images.arrow}/>
            </div>
            <div className="dai">
              <img className="logo" src={Images.daiLogo}/>
              <h2>84.00</h2>
              <p>DAI</p>
            </div>
          </div>
          <div className="secondary-text">
            <p className="title">Why is this happening?</p>
            <p className="paragraph">DAI is a stablecoin that is pegged to the US Dollar, this means it’s value will always stay around $1.00ea. By converting your ETH to DAI, you will avoid the price fluctuations and will have enough funds to cover your subscription for 6 months.</p>
          </div>
        </div>
        <div className="button">
          <p className="convert">Convert to DAI</p>
        </div>
      </div>
    );
  }
};

export default ConversionPrompt;