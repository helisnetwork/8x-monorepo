var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var Authorizable = artifacts.require("./Authorizable.sol");

module.exports = function(deployer) {
    deployer.deploy(EightExToken);
    deployer.deploy(TransferProxy); 
    deployer.deploy(VolumeSubscription);
        
};
