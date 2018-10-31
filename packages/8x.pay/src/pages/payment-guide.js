import React from 'react'; 
import { Link } from 'react-router-dom';
import { default as Images } from '../middleware/images';

class PaymentGuide extends React.Component {
  constructor(props){
    super(props); 

  };

  render() {
    return (
      <div>
        <div className="small-card">
          <div className="hero-guide">
            <div className="guide-header">
              <h1 className="title-large">Paying for Your Subscription</h1>
              <p className="title-small">Here's a guide to starting your subscriptions</p>
            </div>
            <div className="main-container">
              <div className="autho-row">
                <div className="autho-graphic">
                  <img src={Images.authorization}/>
                </div>
                <div className="autho-text">
                  <h2>Authorization</h2>
                  <p>To begin your first subscription, you’ll need to authorize access to your wallet, no funds will be sent during this process. This can be revoked at any time.</p>
                </div>
              </div>
              <div className="balance-row">
                <div className="balance-graphic">
                  <img src={Images.convert}/>
                </div>
                <div className="balance-text">
                  <h2>Required Balance</h2>
                  <p>When you begin your subscription, only the first payment will be charged. Make sure you top up your wallet with the required amount of Dai by the next due date to avoid cancellation. </p>
                </div>
              </div>
              <div className="begin-row">
                <div className="begin-graphic">
                  <img src={Images.daiPeriod}/>
                </div>
                <div className="begin-text">
                  <h2>Begin Subscription</h2>
                  <p>When your subscription starts, each period Dai will be deducted from your authorized wallet. You’re able to convert your ETH to Dai here.</p>
                </div>
              </div>
            </div>
            <Link to='/approve'>
              <div className="get-started-button">
                <p>Get Started</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

    );
  }
}
export default PaymentGuide;