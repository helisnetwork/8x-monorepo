/*Import statements*/
import React from 'react';
import Header from './header';
import { default as Images } from '../middleware/images';

import bus from '../bus';


class MetaMaskNetwork extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      locked: true
    }

  }


  render () {
    return (
      <div className="background">
        <div className="small-card">
          <Header title="Metamask Network" previousPage="/"/>
          <div className="locked-container">
            <img className="graphic" src={Images.metamaskNetwork}/>
            <p className="locked-text">You are connected to the wrong network. Please switch over to the <span>Kovan Network</span></p>
          </div>
        </div> 
      </div>
    );
  }
}

export default MetaMaskNetwork; 