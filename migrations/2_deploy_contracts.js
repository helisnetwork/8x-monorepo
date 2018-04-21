var Plans = artifacts.require("./Plans.sol");
//var Subscription = artifacts.require("./Subscription.sol");

module.exports = function(deployer) {
  
  deployer.deploy(Plans);
  
  /*.then(() => {
    return deployer.deploy(Subscription)
  });*/

};
