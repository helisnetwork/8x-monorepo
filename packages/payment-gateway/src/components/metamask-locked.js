/*Import statements*/
import React from 'react';
import Header from './header';
import { default as Images } from '../middleware/images';


class MetaMaskLocked extends React.Component {
  constructor() {
    super();
  }

  render () {
    return (
      <div className="background">
        <div className="small-card">
          <Header title="MetaMask Locked" previousPage="/"/>
          <div className="locked-container">
            <img src={Images.lockPicture}/>
            <h2 className="locked">Please unlock MetaMask</h2>
          </div>
        </div> 
      </div>
    );
  }
}

export default MetaMaskLocked; 