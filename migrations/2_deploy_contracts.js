var Plans = artifacts.require("./Plans.sol");
var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");

module.exports = function(deployer) {

    deployer.deploy(TransferProxy)
        .then(() => {
            return deployer.deploy(Plans);
        }).then(() => {
            return deployer.deploy(VolumeSubscription);
        })
};
