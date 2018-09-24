import bus from '../bus';
import { default as Images } from '../middleware/images';
import EightEx from '8x.js';

class SubscriptionStore {
  constructor() {

    this.startListening();
  }

  startListening() {
    bus.on('web3:initialised', web3 => {
      console.log(web3);
      this.eightEx = new EightEx(web3, {
        volumeSubscriptionAddress: '0xeff7b9ad5594d105a914a6aa8ef270dae343ee63',
        transactingTokenAddress: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
      });
      this.storePlanHash(); 
      this.retrievePlanListener(); 
    });
    // this.authorizationListener();
    // this.subscribeListener(); 
    // this.activateListener();
  }

  storePlanHash() {
    bus.on('planhash:sent', (planHash) => {
      this.planHash = planHash;
    });
  }

  retrievePlanListener() {
    bus.on('subscription:plan:requested', () => {
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

    // bus.on('subscription:plan:requested', () => {
    //   let subscriptionPlan = 
    //     {
    //       logo: Images.netflixLogo,
    //       subscriptionName: 'Netflix',
    //       subscriptionDetails: 'Premium Account',
    //       subscriptionAmount: 14,
    //       subscriptionPeriod: 'monthly',
    //     }
    //   ;

    //   bus.trigger('subscription:plan:sent', subscriptionPlan); 
    // });
  };

  authorizationListener() {
    bus.on('user:authorization:requested', () => {
      console.log('requested authorization');

      bus.trigger('user:authorization:received', true);
    });
  };

  subscribeListener() {
    bus.on('user:subscribe:requested', () => {
      console.log('i want to subscribe');

      bus.trigger('user:subscribe:completed', true);
    });
  }

  activateListener() {
    bus.on('user:activate:requested', () => {
      console.log('i want to activate');

      bus.trigger('user:activate:completed', true);
    });
  }
};

module.exports = SubscriptionStore;