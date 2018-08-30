/* Import statements */
import React from 'react';
import SubscriptionInfo from './subscripton-info';

class MetamaskHandler extends React.Component {

  constructor (props) {
    super(props);
    
    this.state = {
      status: 'not installed'
    };

    //this.metamaskInstalled = this.metamaskInstalled.bind(this);
    //this.metamaskUnlocked = this.metamaskUnlocked.bind(this);

    //Statement that checks whether metamask is installed
    if (typeof web3 !== 'undefined') {
      var provider = web3.currentProvider;
      this.updateStatus('installed');
      console.log('Metamask is installed');

      web3.eth.getAccounts((err, accounts) => {
        if (err != null) {
          console.log(err);
        }
        else if (accounts.length === 0) {
          console.log('MetaMask is locked');
          this.updateStatus('locked');
        }
        else {
          console.log('MetaMask is unlocked');
          this.updateStatus('unlocked');
        }
      });
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      this.updateStatus('not installed');
    }
  }


  render() {
    return ( 
      //loaded is passed boolean to decide whether to render the payment page
      <SubscriptionInfo status={this.state.status}/>
    );
  }

  updateStatus(update) {
    this.setState({
      status: update
    });
  };

};


export default MetamaskHandler;