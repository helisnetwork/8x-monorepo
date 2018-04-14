var EthMe = artifacts.require("./EthMe.sol");

contract('EthMe', function(accounts) {
  it("should deploy", function() {
    return EthMe.deployed();
  });
});
