import React from 'react';
import Header from '../components/header';
import { default as Images } from '../middleware/images';

class BeginSubscription extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (
      <div className="small-card">
        <Header title="Begin Subscription" previousPage='/conversion'/>
        <div className="content">
          <div className="header-text">
            <h2 className="header-bold">Your conversion is now complete</h2>
            <p className="header-small">You are ready to begin your subscription</p>
          </div>
          <div className="graphic">
            <img src={Images.daiConfirm}/>
          </div>
          <div className="subtext">
            <p className="subtext-bold">What happens next?</p>
            <p className="subtext-small">Your subscription will now start, and each month 14.00 DAI will be deducted from your Personal Wallet. Once your balance becomes low, we will notify you and will need to top up your account.</p>
          </div>
        </div>
        <div className="button">
          <p className="begin-subscription">Begin Subscription – $14/month</p>
        </div>
      </div>
    );
  };
};

export default BeginSubscription;