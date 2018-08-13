/* Import statements */
import React from 'react';

import Header from '../components/header.js';
import {default as Images} from '../middleware/images';

/* App component */
class Privatekey extends React.Component {
  render() {
    return (
      <div>
        <div className="small-card">
          <Header title="Save your Private Keys"/>
          <div className="header">
            <h1>Please carefully write down your keys, or <span>print</span> them.</h1>
          </div>
          <div className="item">
          </div>
          <div className="middle-text">
            <p>Once you have finished writing down your keys, please store them in a safe location. It is a good idea to make copies, and store your keys across multiple locations. Please DO NOT store your keys on your computer, or an online service such as Dropbox of Google Drive.</p>
          </div>
          <div className="checkbox">
            <p>Checkbox</p>
            <p>Checkbox2</p>
          </div>
          <div className="cta-button">
            <p className="text">Please confirm above</p>
          </div>   
        </div> 
      </div>
    );
  }
};

export default Privatekey;
