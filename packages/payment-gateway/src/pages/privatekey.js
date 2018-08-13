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
          <div className="hero">
            <div className="header-text">
              <h1>Please carefully write down your keys, or <span>print</span> them.</h1>
            </div>
            <div className="item">
              <p>Dog</p> 
              <p>Cheese</p>
              <p>Seed</p>
              <p>Cat</p>
              <p>Excited</p>
              <p>Bear</p>
              <p>Mouse</p>
              <p>Happy</p>
              <p>Please</p>
              <p>Pig</p>
              <p>Hour</p>
              <p>Hello</p>
            </div>
            <div className="middle-text">
              <p>Once you have finished writing down your keys, please store them in a safe location. It is a good idea to make copies, and store your keys across multiple locations. Please DO NOT store your keys on your computer, or an online service such as Dropbox of Google Drive.</p>
            </div>
            <div className="checkbox">
              <div className="tick one">
                <div className="square">
                </div>
                <p>I have printed or written down my keys</p>
              </div>
              <div className="tick two">
                <div className="square">
                </div>
                <p>I have stored my keys in safe place</p>
              </div>
            </div>
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
