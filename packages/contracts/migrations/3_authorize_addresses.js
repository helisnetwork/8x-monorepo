const Constants = require("./migration_constants");

module.exports = function(deployer, network, accounts) {

    if (!Constants.isActualDeployment(network)) {
        return;
    }

    const TransferProxy = artifacts.require("./TransferProxy.sol");
    const PaymentRegistry = artifacts.require("./PaymentRegistry.sol");
    const StakeContract = artifacts.require("./StakeContract.sol");
    const VolumeSubscription = artifacts.require("./VolumeSubscription.sol");
    const Executor = artifacts.require("./Executor.sol");

    return deployer.then(async() => {

        let transferProxy = await TransferProxy.deployed();
        let stakeContract = await StakeContract.deployed();
        let paymentRegistry = await PaymentRegistry.deployed();
        let executor = await Executor.deployed();
        let volumeSubscription = await VolumeSubscription.deployed();

        await transferProxy.addAuthorizedAddress(executor.address);
        await stakeContract.addAuthorizedAddress(executor.address);
        await paymentRegistry.addAuthorizedAddress(executor.address);
        await volumeSubscription.addAuthorizedAddress(executor.address);

    });

};