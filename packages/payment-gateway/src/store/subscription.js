import bus from '../bus';
import { default as Images } from '../middleware/images';

class SubscriptionStore {
  constructor() {

    this.startListening();
  }

  startListening() {
    this.startPlanListening(); 
  }

  startPlanListening() {
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

      bus.trigger('subscription:plan:sent',subscriptionPlan); 
    });
  };

};

module.exports = SubscriptionStore;