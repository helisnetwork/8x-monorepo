import bus from '../bus';
import EightEx from '8x.js';
import BigNumber from 'bignumber.js';

import { getContract, getToken } from '../constants';

export default class SubscriptionStore {
  constructor() {

    this.startListeners();
    this.listenPlanHash();
    this.listenPlanRequested();

  }

  startListeners() {
    bus.on('web3:initialised', web3 => {

      this.eightEx = new EightEx(web3, {
        volumeSubscriptionAddress: getContract('VolumeSubscription'),
        transactingTokenAddress: getToken('DAI'),
        transferProxyAddress: getContract('TransferProxy'),
        executorAddress: getContract('Executor')
      });

      // Retrieve metamask account
      web3.eth.getAccounts((err, accounts) => {

        if (err != null) {
          console.log('cannot get address');
        } else if (accounts.length === 0 ) {
          console.log('you have not logged in');
        } else {

          this.address = accounts;
          this.web3 = web3;

          // Check if user has already authorized 
          this.checkAlreadyAuthorized();
          // Start listeners for subscription process
          this.authorizationRequestListener();
          this.subscribeRequestListener();
          this.activateSubscriptionListener();
        }
      });
    });
  }

  checkAlreadyAuthorized() {
    this.eightEx.subscriptions.hasGivenAuthorisation(this.address).then((result) => {
      if (result == true) {
        console.log('The user has already given authorisation');
        bus.trigger('user:authorization:received');
      }
    });
  }

  listenPlanHash() {
    bus.on('planHash:sent', (planHash) => {
      this.planHash = planHash;
    });
  }

  listenPlanRequested() {
    bus.on('subscription:plan:requested', () => {

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
      this.eightEx.plans.get(
        this.planHash
      ).then((elem) => {
        this.currentPlan = Array.from(elem);
        console.log(elem);
        if (this.currentPlan) {
          const currencyBase = new BigNumber(10).pow(18);
          const planObj = (({ image, name, description, amount, interval }) => ({
            logo: image,
            subscriptionName: name,
            subscriptionDetails: description,
            subscriptionAmount: amount.div(currencyBase).toNumber(),
            subscriptionPeriod: interval
          }))(elem);
          console.log(planObj);
          bus.trigger('subscription:plan:sent', planObj);
        }
      });
    });
  };

  authorizationRequestListener() {
    bus.on('user:authorization:requested', () => {
      bus.trigger('loading:state');
      this.eightEx.subscriptions.giveAuthorisation(
      ).then((txHash) => {
        this.eightEx.blockchain.awaitTransactionMinedAsync(
          txHash
        ).then(bus.trigger('user:authorization:received'));
        }).catch((error) => bus.trigger('authorization:cancelled', error));
    });
  };

  subscribeRequestListener() {
    bus.on('start:subscribe:process', () => {
      bus.trigger('loading:state');
      const txData = null;
      const metaData = null;
      this.eightEx.subscriptions.subscribe(
        this.planHash,
        metaData,
        txData
      ).then((subscriptionHash) => {
        bus.trigger('user:subscribe:completed', subscriptionHash);
        this.subscriptionHash = subscriptionHash;
      });
    });

    bus.on('user:subscribe:requested', () => {
      this.eightEx.subscriptions.hasGivenAuthorisation(
        this.address
      ).then((boolean) => {
        if(boolean === true) {
          bus.trigger('start:subscribe:process');
        } else {
          console.log('Authorization not given');
        }
      });
    });
  }

  activateSubscriptionListener() {
    bus.on('user:activate:requested', () => {
      bus.trigger('loading:state');
      const txData = null;
      if (this.subscriptionHash) {
        this.eightEx.subscriptions.activate(
          this.subscriptionHash,
          txData
        ).then((txHash) => {
          this.eightEx.blockchain.awaitTransactionMinedAsync(
            txHash
          ).then(bus.trigger('user:activate:completed', this.subscriptionHash),
            console.log('Subscription receipt is' + ' ' + txHash)
          ).catch((error) => console.log(error));
        });
      };
    });
  }
};