var Plans = artifacts.require("./Plans.sol");
var Subscriptions = artifacts.require("./Subscriptions.sol");

module.exports = async function(deployer) {
  
  await deployer.deploy(Plans);
  await deployer.deploy(Subscriptions, 0);

};
