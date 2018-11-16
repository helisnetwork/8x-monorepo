import React from 'react'; 
import { default as Images } from '../middleware/images';
import bus from '../bus';

import { Redirect } from 'react-router-dom';

import { MoonLoader } from 'react-spinners';
import SubscriptionInfo from './subscripton-info';
import ConversionPrompt from './conversion-prompt';

class Approve extends React.Component {
  constructor(props){
    super(props); 

    this.state = {
      approve: false,
      awaiting: false,
      conversion: ''

    };

    this.submitAuthorization = this.submitAuthorization.bind(this);
    this.updateApproveState = this.updateApproveState.bind(this);
    this.catchAuthFailed = this.catchAuthFailed.bind(this);

  };

  componentDidMount() {
    this.updateApproveState(); 
    this.catchAuthFailed();
    this.checkConversionStatus();
  }

  componentWillUnmount() {
    bus.off('conversion:status');
    bus.off('authorization:process:failed');
    bus.off('user:authorization:received');
  }

  checkConversionStatus() {
    bus.on('conversion:status', (status) => {
      this.setState({
        conversion: status
      });
    });
  }

  catchAuthFailed() {
    bus.on('authorization:process:failed', () => {
      this.setState({
        approve: false,
        awaiting: false 
      });
    });
  }

  submitAuthorization() {
  bus.trigger('user:authorization:requested');
    this.setState({
      awaiting: true
    });
  }

  updateApproveState() {
    bus.on('user:authorization:received', (status) => {
      this.setState({
        approve: status,
        awaiting: false 
      });
    });
  }

  returnApproveButton() {
    if(this.state.approve === true) {
      return (
        <div className="approve-complete">
          <p>Approved</p>
        </div>
      );
    }
    else if(this.state.approve === false && this.state.awaiting === true){
      return (
        <div className="approve-container">
          <MoonLoader color={'#8E87B1'} sizeUnit={"px"} size={25}/>
          <p>Awaiting Approval</p>
          <div></div>
        </div>
      );
    }
    else if(this.state.approve === false && this.state.awaiting === false) {
      return (
        <div className="approve-complete" onClick={() => {this.submitAuthorization()}}>
          <p>Approve Tokens</p>
        </div>
      );
    }
  }

  render() {
    if(this.state.approve === false) {
      return (
        <div>
          <div className="small-card">
            <div className="hero-approve">
              <div className="metamask-graphic">
                <img src={Images.metamaskLarge}/>
              </div>
              <div className="approve-large-text">
                <h1>You'll need to approve Dai for your subscription via Metamask</h1>
              </div>
              <div className="approve-small-text">
                <p>Please approve the transaction in the Metamask window to continue the subscription process.</p>
              </div>
              <div className="approve-button">
                {this.returnApproveButton()}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      if(this.state.conversion === true) {
        return <ConversionPrompt/>;
      } else if(this.state.conversion === false) {
        return (
          <SubscriptionInfo
          status="unlocked"/>
        )
      } else {
        return null;
      }
    }
  }
}
export default Approve;