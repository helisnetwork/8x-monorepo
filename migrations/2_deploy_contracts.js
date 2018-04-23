var Plans = artifacts.require("./Plans.sol");
var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");

module.exports = function(deployer) {

    deployer.deploy(EightExToken)
        .then(() => {
            return deployer.deploy(TransferProxy);
        })
        .then(() => {
            return deployer.deploy(Plans);
        }).then(() => {
            return deployer.deploy(VolumeSubscription);
        })
};
