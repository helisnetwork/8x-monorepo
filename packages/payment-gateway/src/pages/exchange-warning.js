/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';

/* App component */
class ExchangeWarning extends React.Component {
  render() {
    return (
      <div>
        <div className="main-card">
          <Header/>
          <div className="hero">
            <div className="icon">
				    	<img src={Images.alertLogo}/>
            </div>
            <div className="text">
              <h1>Funds stored on an exchange are not secure!</h1>
              <p className="middle-text">Funds that are stored on an exchange are vunerable to attacks and are always under the control of a third party.</p>
              <h2>To pay for this subscription using cryptocurrency, will need to setup a personal wallet.</h2>
            </div>
          </div>
          <div className="button">
          	<p>Setup a Personal Wallet</p>
          </div>
        </div>     
      </div>
    );
  }
};

export default ExchangeWarning;
