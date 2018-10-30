import React from 'react'; 
import { default as Images } from '../middleware/images';
import bus from '../bus';

import { Redirect } from 'react-router-dom';

import { MoonLoader } from 'react-spinners';
import SubscriptionInfo from './subscripton-info';

class Approve extends React.Component {
  constructor(props){
    super(props); 

    this.state = {
      approve: false,
      awaiting: false

    };

    this.submitAuthorization = this.submitAuthorization.bind(this);
    this.updateApproveState = this.updateApproveState.bind(this);
    this.catchAuthFailed = this.catchAuthFailed.bind(this);

  };

  componentDidMount() {
    this.updateApproveState(); 
    this.catchAuthFailed();
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
        <Redirect
          to={{
            pathname: '/subscription-info',
            state: { approve: this.state.approve }
          }}
        />
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
  }
}
export default Approve;