/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';
import Dropdown from '../components/dropdown.js';

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
                <img src={Images.netflixLogo}/>
              </div>
              <div className="text">
                <p>Netflix - Premium Account</p>
                <span>$14USD billed monthly</span>
              </div>
            </div>
            <div className="option">
              <div className="currency">
                <div className="text">
                  <p>I want to pay using</p>
                </div>
                <Dropdown/> 
              </div>
              <div className="time">
                <div className="text">
                  <p>I want to top my account every</p>
                </div>
                <div className="box time">
                  <p>6 months</p>
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
