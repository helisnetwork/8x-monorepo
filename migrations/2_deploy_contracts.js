var Plans = artifacts.require("./Plans.sol");
var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var ETXToken = artifacts.require("./ETXToken.sol");

module.exports = function(deployer) {

    deployer.deploy(ETXToken)
        .then(() => {
            return deployer.deploy(TransferProxy);
        })
        .then(() => {
            return deployer.deploy(Plans);
        }).then(() => {
            return deployer.deploy(VolumeSubscription);
        })
};
