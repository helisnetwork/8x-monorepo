var TransferProxy = artifacts.require("./TransferProxy.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var PaymentRegistry = artifacts.require("./PaymentRegistry.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var Executor = artifacts.require("./Executor.sol");

var EightExToken = artifacts.require("./EightExToken.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");

var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");

module.exports = function(deployer, network) {

    let transferProxy;
    let stakeContract;
    let paymentRegistry;
    let approvedRegistry;
    let executor;

    let eightExToken;
    let wrappedEther;

    let volumeSubscription;

    let daiAddress = (network == 'live') ? '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' : '0xc4375b7de8af5a38a93548eb8453a498222c4ff2';

    /**
     * Deploy a transfer proxy
     * Deploy the 8x token
     * Deploy the stake contract with the 8x token in the initialiser
     * Deploy the approved registry
     * Add the volume subscription as an approved contract to the registry
     * Deploy WETH
     * Add WETH + DAi as approved tokens to registry
     * Deploy the volume subscription contract with approve registry in constructor
     * Deploy the executor with transfer proxy, stake contract, payment registry & approved registry
     * Add the executor as an authorised contract to transfer proxy, stake contract & payment registry
    */

    deployer.deploy(TransferProxy).then(function(instance) {
        transferProxy = instance;
        return deployer.deploy(EightExToken);
    }).then(function(instance) {
        eightExToken = instance;
        return deployer.deploy(StakeContract, eightExToken.address);
    }).then(function(instance) {
        stakeContract = instance;
        return deployer.deploy(ApprovedRegistry)
    }).then(function(instance) {
        approvedRegistry = instance;
        return deployer.deploy(VolumeSubscription, approvedRegistry.address);
    }).then(function(instance) {
        volumeSubscription = instance;
        return deployer.deploy(WrappedEther);
    }).then(function(instance) {
        wrappedEther = instance;
        return deployer.deploy(PaymentRegistry)
    }).then(function(instance) {
        paymentRegistry = instance;
        return Promise.all[
            approvedRegistry.addApprovedContract(volumeSubscription.address),
            approvedRegistry.addApprovedToken(wrappedEther.address),
            approvedRegistry.addApprovedToken(daiAddress),
            approvedRegistry.setApprovedTokenMultiplier(wrappedEther.address, 10),
            approvedRegistry.setApprovedTokenMultiplier(daiAddress, 10)
        ];
    }).then(function(instance) {
        return deployer.deploy(
            Executor,
            transferProxy.address,
            stakeContract.address,
            paymentRegistry.address,
            0,
            approvedRegistry.address
        )
    }).then(function(instance) {
        executor = instance;
        return Promise.all[
            transferProxy.addAuthorizedAddress(executor.address),
            stakeContract.addAuthorizedAddress(executor.address),
            paymentRegistry.addAuthorizedAddress(executor.address),
            volumeSubscription.addAuthorizedAddress(executor.address)
        ];
    }).catch(function(error) {
        console.log("CATCH-ERROR " + error);
    });

};
