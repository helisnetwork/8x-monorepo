/*Import statements*/
import React from 'react';
import Header from './header';

class MetaMaskLocked extends React.Component {
  constructor() {
    super();
  }

  render () {
    return (
      <div>
        <div className="small-card">
          <Header title="MetaMask Locked" previousPage="/"/>
          <h2 className="locked">Please unlock metaMask</h2>
        </div> 
      </div>
    );
  }
}

export default MetaMaskLocked; 