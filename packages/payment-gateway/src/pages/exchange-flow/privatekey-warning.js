/* Import statements */
import React from 'react';

import Header from '../../components/header.js';
import {default as Images} from '../../middleware/images.js';

/* App component */
class PrivatekeyWarning extends React.Component {
  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="Setup a Personal Wallet"/>
          <div className="hero">
            <div className="icon">
              <img src={Images.keyImage}/>
            </div>
            <div className="text">
              <h1>How do you access your wallet?</h1>
              <p className="middle-text">Just like the pin number for your bank account, your personal wallet uses a Private Key. Your private key will be given to you in the form of 12 randomly generate words, often referred to as your seed phase.</p>
              <h2 className="warning">Please note. If you lose your key, you will lose access to any funds stored in your wallet.</h2>
            </div>
          </div>
          <div className="cta-button">
            <p className="text">I Understand</p>
          </div>   
        </div> 
      </div>
    );
  }
};

export default PrivatekeyWarning;
