var ConvertLib = artifacts.require("./ConvertLib.sol");
var EthMe = artifacts.require("./EthMe.sol");

module.exports = function(deployer) {
  deployer.deploy(EthMe);
};
