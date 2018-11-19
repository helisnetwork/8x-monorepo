import bus from '../bus';
import EightEx from '8x.js';
import BigNumber from 'bignumber.js';

import { getContract, getToken } from '../constants';

export default class SubscriptionStore {
  constructor() {

    this.startListeners();
    this.listenPlanHash();
  }

  startListeners() {
    bus.on('web3:initialised', (web3) => {


      this.eightEx = new EightEx(web3, {
        volumeSubscriptionAddress: getContract('VolumeSubscription'),
        transactingTokenAddress: getToken('DAI'),
        transferProxyAddress: getContract('TransferProxy'),
        executorAddress: getContract('Executor')
      });

      this.listenPlanRequested();

      //Start subscription listener after this.address is avaliable and web3 set. 
      bus.on('user:address:sent', (address) => {
        if(!this.address) {
          this.address = address; 
          this.web3 = web3; 
          // Check if user has already authorized 
          this.checkAlreadyAuthorized();
          // Start listeners for subscription process
          this.authorizationRequestListener();
          this.startSubscribeAndActivate();
          // this.activateSubscriptionListener();
        }
      });
    });
  }

  checkAlreadyAuthorized() {
    
    bus.on('authorization:status', async () => {
      let authorizedStatus = await this.eightEx.subscriptions.hasGivenAuthorisation(this.address);
        if (authorizedStatus == true) {
          bus.trigger('user:authorization', true);
        } else {
          bus.trigger('user:authorization', false);
        }
    });
  }

  listenPlanHash() {
    bus.on('planHash:sent', (planHash) => {
      this.planHash = planHash;
    });
  }

  listenPlanRequested() {
    bus.on('subscription:plan:requested', async (elem) => {      
      // Show dummy data if there's no plan hash
      if (!this.planHash) {
        bus.trigger('subscription:plan:sent', {
          logo: null,
          subscriptionName: 'Netflix [DEMO]',
          subscriptionDetails: 'Premium Plan',
          subscriptionAmount: 14,
          subscriptionPeriod: 30*24*60*60
        });
        return;
      }

      // Get the actual plan using the planHash passed in
      let planData = await this.eightEx.plans.get(
        this.planHash
      );
      
      if(planData) {
        const currencyBase = new BigNumber(10).pow(18);
        const planObj = (({ image, name, description, amount, interval }) => ({
          logo: image,
          subscriptionName: name,
          subscriptionDetails: description,
          subscriptionAmount: amount.div(currencyBase).toNumber(),
          subscriptionPeriod: interval
        }))(planData);
        if(elem === 'subscription-plan-render') {
          bus.trigger('subscription:plan:sent', planObj);
        } else if(elem === 'rates') {
          bus.trigger('subscription:plan:for:exchange:rates', planObj);
        } else if(elem === 'conversion') {
          bus.trigger('subscription:plan:for:conversion', planObj);
        }
      }
    });
  };

  authorizationRequestListener() {
    bus.on('user:authorization:requested', async () => {
      bus.trigger('loading:state');
      try {
        let authorizationTxHash = await this.eightEx.subscriptions.giveAuthorisation(
        );

        let authorizationStatus = await this.eightEx.blockchain.awaitTransactionMinedAsync(
          authorizationTxHash
        ); 

        if(authorizationStatus) {
          console.log(authorizationTxHash);
          bus.trigger('user:authorization:received', true);
        }
        
      } catch (error) {
        bus.trigger('authorization:process:failed', error);
        console.log('Authorization process has failed' + ' ' + error);
      }
    });
  };

  startSubscribeAndActivate () {
    bus.on('user:subscribe:requested', async () => {
      bus.trigger('loading:state');
      const txData = null;
      const metaData = null;

      try {
        this.subscriptionHash = await this.eightEx.subscriptions.subscribeAndActivate(this.planHash, metaData, txData);
        
        if(this.subscriptionHash) {
          bus.trigger('user:subscribe:completed', this.subscriptionHash);
        }
        
      } catch (error) {
        bus.trigger('subscription:process:failed');
        console.log('Subscription process has failed' + ' ' + error);
      }


    })
  }

  // startSubscribeListener() {
  //   bus.on('user:subscribe:requested', async () => {
  //     bus.trigger('loading:state');
  //     const txData = null;
  //     const metaData = null;

  //     try {
  //       this.subscriptionHash = await this.eightEx.subscriptions.subscribe(this.planHash, metaData, txData);
        
  //       if(this.subscriptionHash) {
  //         bus.trigger('user:subscribe:completed', this.subscriptionHash);
  //       }
        
  //     } catch (error) {
  //       bus.trigger('subscription:process:failed');
  //       console.log('Subscription process has failed' + ' ' + error);
  //     }
  //   });
  // }

  // activateSubscriptionListener() {
  //   bus.on('user:activate:requested', async () => {
  //     bus.trigger('loading:state');
  //     const txData = null;
  //     if (this.subscriptionHash) {
  //       try {
  //         let activationTxHash = await this.eightEx.subscriptions.activate(this.subscriptionHash, txData);

  //         let activationStatus = await this.eightEx.blockchain.awaitTransactionMinedAsync(
  //           activationTxHash
  //         ); 

  //         if(activationStatus) {
  //           bus.trigger('user:activate:completed', this.subscriptionHash);
  //           console.log('Subscription receipt is' + ' ' + activationTxHash);
  //         }
          
  //       } catch (error) {
  //         bus.trigger('activation:process:failed'); 
  //         console.log('Activation process has failed' + ' ' + error);
  //       }
  //     };
  //   });
  // }
};