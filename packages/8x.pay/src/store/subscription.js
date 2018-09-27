import bus from '../bus';
import { default as Images } from '../middleware/images';
import EightEx from '8x.js';
import { ExecutorAbi } from '@8xprotocol/artifacts';


class SubscriptionStore {
  constructor() {

    this.startListeners();
    this.listenPlanHash();
    this.listenPlanRequested();
  }

  startListeners() {
    bus.on('web3:initialised', web3 => {
      console.log(web3);
      this.eightEx = new EightEx(web3, {
        volumeSubscriptionAddress: '0xeff7b9ad5594d105a914a6aa8ef270dae343ee63',
        transactingTokenAddress: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
        transferProxyAddress: '0x9554eb0ee8ef5641ba976306c829ae0266315e4f',
        executorAddress: '0xd27e811ceebb6f5dbe85588721f69079ebd35dc9'
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
          const planObj = (({ image, name, description, amount, interval }) => ({
            logo: image,
            subscriptionName: name,
            subscriptionDetails: description,
            subscriptionAmount: amount.c,
            subscriptionPeriod: interval
          }))(elem);
          console.log(planObj);
          bus.trigger('subscription:plan:sent', planObj);
        }
      });
    });
  };

  listenAuthorization() {
    bus.on('user:authorization:requested', () => {
      this.eightEx.subscriptions.giveAuthorisation(
      ).then((obj) => {
        if (obj !== null) {
          bus.trigger('user:authorization:received', true);
          bus.trigger('user:subscribe:requested');
        } else {
          console.log('User cancelled transaction');
        }
      });
    });
  };

  listenSubscribe() {
    bus.on('start:subscribe:process', () => {
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
        console.log(boolean);
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

module.exports = SubscriptionStore;