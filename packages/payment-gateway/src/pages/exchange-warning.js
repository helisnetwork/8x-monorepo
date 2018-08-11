/* Import statements */
import React from 'react';

import {default as Images} from '../middleware/images';

/* App component */
class ExchangeWarning extends React.Component {
  render() {
    return (
      <div>
        <div className="main-card">
          <div className="card-buttons">
            <p className="cancel">Back</p>
            <p className="close">Close</p>
          </div>
          <div className="hero">
            <div className="icon">
				   <img src={Images.alertLogo}/>
            </div>
            <div className="text">
              <p>Funds stored on an Exchange are not secure!</p>
            </div>
            <div className="text">
              <p>Funds that are stored on an exchange are vunerable to attacks and are always under the control of a third party.</p>
            </div>
            <div className="text">
              <p>To pay for this subscription using cryptocurrency, will need to setup a personal wallet.</p>
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
