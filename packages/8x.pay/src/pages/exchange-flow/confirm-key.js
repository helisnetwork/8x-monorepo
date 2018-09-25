/* Import statements */
import React from 'react';

import Header from '../../components/header.js';

/* App component */
class ConfirmKey extends React.Component {
  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="Confirm your Keys"/>
          <div className="hero">
            <div className="text">
              <h1>Please type in your first, third and last key.</h1>
              <p className="middle-text">We need to make sure you have written down your keys.</p>
            </div>
            <div className="confirm-box">
              <div className="item">
                <p>First Key</p>
              </div>
              <div className="item">
                <p>Third Key</p>
              </div>
              <div className="item">
                <p>Last Key</p>
              </div>
            </div>
          </div>
          <div className="cta-button">
            <p>Please type in your keys</p>
          </div>
        </div>    
      </div>
    );
  }
};


export default ConfirmKey;
