import bus from '../bus';
import EightEx from '8x.js';

import { default as Images } from '../middleware/images';
import { ExecutorAbi } from '@8xprotocol/artifacts';
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

      web3.eth.getAccounts((err, accounts) => {

        if (err != null) {
          console.log('cannot get address');
        } else if (accounts.length === 0 ) {
          console.log('you have not logged in');
        } else {

          this.address = accounts;
          console.log(this.address);
          this.web3 = web3;
          this.listenAuthorization();
          this.listenSubscribe();
          this.listenUserActivation();
        }
      });
    });
  }

  listenPlanHash() {
    bus.on('planhash:sent', (planHash) => {
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

      this.eightEx.subscriptions.hasGivenAuthorisation(this.address).then((result) => {
        if (result == true) {
          console.log('The user has already given authorisation');
          bus.trigger('user:authorization:received', true);
        }
      });

    });
  };

  listenAuthorization() {
    bus.on('user:authorization:requested', () => {
      bus.trigger('loading:state');
      this.eightEx.subscriptions.giveAuthorisation(
      ).then((obj) => {
        if (obj !== null) {
          bus.trigger('user:authorization:received');
        } else {
          console.log('User cancelled transaction');
        }
      }).catch((error) => bus.trigger('authorization:cancelled', error));
    });
  };

  listenSubscribe() {
    bus.on('start:subscribe:process', () => {
      bus.trigger('loading:state');
      const txData = null;
      const metaData = null;
      this.eightEx.subscriptions.subscribe(
        this.planHash,
        metaData,
        txData
      ).then((subscriptionHash) => {
        bus.trigger('user:subscribe:completed', subscriptionHash, true);
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

  listenUserActivation() {
    bus.on('user:activate:requested', () => {
      bus.trigger('loading:state');
      const txData = null;
      if (this.subscriptionHash) {
        this.eightEx.subscriptions.activate(
          this.subscriptionHash,
          txData
        ).then((receipt) => {
          bus.trigger('user:activate:completed', this.subscriptionHash, true);
          console.log('Subscription receipt is' + '' + receipt);
        });
      };
    });
  }
};