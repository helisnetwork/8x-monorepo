/* Import statements */
import React from 'react'; 
import SubscriptionInfo from './subscripton-info';
import TrezorConnect, { DEVICE_EVENT, DEVICE } from 'trezor-connect';

class TrezorHandler extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      status: 'loading'
    };

    this.trezorLogin();
  }

  trezorLogin() {
    var challenge_hidden = '';
    var challenge_visual = '';

    this.requestLogin();

  };

  requestLogin () {
    TrezorConnect.requestLogin('hosticon', 'challenge_hidden', 'challenge_visual', function (response) {
      if (response.success) {
        console.log('Address', reponse.address);// Test if this works
        console.log('Public key:', response.public_key); // pubkey in hex
        console.log('Signature:', response.signature); // signature in hex
        console.log('Version 2:', response.version === 2); // version field
        this.updateStatus('unlocked');
      } else {
        console.error('Error:', response.error);
        this.updateStatus('locked');
      }
      console.log('hi');
      document.getElementById('response').innerHTML = JSON.stringify(response, undefined, 2);
    });
  };

  render() {
    return (
      <SubscriptionInfo status={this.state.status}/>
    );
  }

  updateStatus(update) {
    this.setState({
      status: update
    });
  };

};

export default TrezorHandler;