var Plan = artifacts.require("./Plan.sol");

module.exports = function(deployer) {
  deployer.deploy(
    Plan, // The actual contract
    "0xdd04ccf62bc7103e398e1b229a1e97a00bfc2381", // Owner address
    "Test", // Name
    30, // Interval (in days)
    10 // Amount (in cents)
  );
};
