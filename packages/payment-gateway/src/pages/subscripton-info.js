/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';

/* App component */
class SubscriptionInfo extends React.Component {
  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="Subscription Information"/>
          <div className="hero">
            <div className="main-item">
              <div className="logo">
                <p>Netflix</p>
              </div>
              <div className="text">
                <p>14</p>
              </div>
            </div>
            <div className="option">
              <div className="currency">
                <div className="text">
                  <p>I want</p>
                </div>
                <div className="box">
                  <p>Eth</p>
                </div>
              </div>
              <div className="time">
                <div className="text">
                  <p>top up</p>
                </div>
                <div className="box">
                  <p>6</p>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    );
  }
};

export default SubscriptionInfo;
