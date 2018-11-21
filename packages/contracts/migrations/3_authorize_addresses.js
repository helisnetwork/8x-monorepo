const Constants = require("./migration_constants");

module.exports = function(deployer, network, accounts) {

    if (!Constants.isActualDeployment(network)) {
        return;
    }

    const MultiSigWalletWithTimeLock = artifacts.require("./MultiSigWalletWithTimeLock.sol");

    const VolumeSubscription = artifacts.require("./subscriptions/VolumeSubscription.sol");

    const ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
    const TransferProxy = artifacts.require("./TransferProxy.sol");
    const PaymentRegistry = artifacts.require("./PaymentRegistry.sol");
    const StakeContract = artifacts.require("./StakeContract.sol");
    const Executor = artifacts.require("./Executor.sol");
    const EightExToken = artifacts.require("./EightExToken.sol");

    return deployer.then(async() => {

        // Add Authorized Addresses

        let multiSig = await MultiSigWalletWithTimeLock.deployed();

        let approvedRegistry = await ApprovedRegistry.deployed();
        let transferProxy = await TransferProxy.deployed();
        let stakeContract = await StakeContract.deployed();
        let paymentRegistry = await PaymentRegistry.deployed();
        let executor = await Executor.deployed();
        let volumeSubscription = await VolumeSubscription.deployed();
        let eightExToken = await EightExToken.deployed();

        await transferProxy.addAuthorizedAddress(executor.address);
        await stakeContract.addAuthorizedAddress(executor.address);
        await paymentRegistry.addAuthorizedAddress(executor.address);
        await volumeSubscription.addAuthorizedAddress(executor.address);

        // Change ownership

        await approvedRegistry.transferOwnership(multiSig.address);
        await transferProxy.transferOwnership(multiSig.address);
        await stakeContract.transferOwnership(multiSig.address);
        await paymentRegistry.transferOwnership(multiSig.address);
        await executor.transferOwnership(multiSig.address);
        await volumeSubscription.transferOwnership(multiSig.address);

        // Leave one token to the person who deployed
        //await eightExToken.transfer(multiSig, 2 ** 256 - 2);
        await eightExToken.transferOwnership(multiSig.address);

    });

};