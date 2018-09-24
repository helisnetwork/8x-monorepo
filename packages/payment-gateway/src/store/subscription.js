import bus from '../bus';
import { default as Images } from '../middleware/images';
import EightEx from '8x.js';

class SubscriptionStore {
  constructor() {

    this.startListening();
  }

  startListening() {
    this.retrievePlanListener(); 
    this.authorizationListener();
    this.subscribeListener(); 
    this.activateListener();
  }

  retrievePlanListener() {
    bus.on('subscription:plan:requested', () => {
      let subscriptionPlan = 
        {
          logo: Images.netflixLogo,
          subscriptionName: 'Netflix',
          subscriptionDetails: 'Premium Account',
          subscriptionAmount: 14,
          subscriptionPeriod: 'monthly',
        }
      ;

      bus.trigger('subscription:plan:sent', subscriptionPlan); 
    });
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