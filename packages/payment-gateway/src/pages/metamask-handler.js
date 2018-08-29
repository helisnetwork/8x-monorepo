/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';

class MetamaskHandler extends React.Component {

  constructor (props) {
    super(props);

    if (typeof web3 !== 'undefined') {
      var provider = web3.currentProvider;
      this.state = {
        installed: true,
      };
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      this.state = {
        installed: false,
      };
    }
  }

  render() {
    return (
      <SubscriptionInfo loaded={this.state.installed}/>
    );
  }
};

export default MetamaskHandler;