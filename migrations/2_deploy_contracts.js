var Plan = artifacts.require("./Plan.sol");
var Subscription = artifacts.require("./Subscription.sol");

module.exports = function(deployer) {

  let initialStart = Date.now();
  initialStart = parseInt(initialStart/1000);

  deployer.deploy(Plan,"0xf669958a3668e62b6aebbfdc995c9fdeaacaceaf", "Test", 30, 10).then(() => {
    return deployer.deploy(Subscription, "0xdd04ccf62bc7103e398e1b229a1e97a00bfc2381", initialStart, Plan.address)
  });

};
