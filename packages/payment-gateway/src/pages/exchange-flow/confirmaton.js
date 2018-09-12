import React from 'react'; 
import Header from '../../components/header';

import { default as Images } from '../../middleware/images';

export default class Confirmation extends React.Component {
  
  constructor(){
    super();

  }

  render(){
    return (
      <div className="background">
        <div className="small-card">
          <Header title="Payment Successful" previousPage="/"/>
          <div className="hero-confirm">
            <div className="confirmation-logo">
              <img src={Images.checkTick}/>
            </div>
            <div className="confirmation-text">
              <p>Thank you, your payment has been successful. A confirmation email has been sent to <span>hello@8xprotocol.com</span></p>
            </div>
            <div className="receipt">
              <p><span>Transaction Hash:</span> 0x83e578f95b89dfb9d174cdc2c63352925c3b932118cfae1aeb7d2c1872fa4d92</p> 
              <p><span>Balance:</span> 68 DAI</p>
              <p><span>Date:</span> 10/09/2018</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
}