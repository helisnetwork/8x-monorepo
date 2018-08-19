var TransferProxy = artifacts.require("./TransferProxy.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var PaymentRegistry = artifacts.require("./PaymentRegistry.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var Requirements = artifacts.require("./Requirements.sol");
var Executor = artifacts.require("./Executor.sol");

var EightExToken = artifacts.require("./EightExToken.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");

var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");

module.exports = function(deployer, network, accounts) {

    let transferProxy;
    let stakeContract;
    let paymentRegistry;
    let approvedRegistry;
    let executor;
    let requirementsContract;

    let eightExToken;
    let wrappedEther;

    let volumeSubscription;

    let daiAddress = (network == 'live') ? '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' : '0xc4375b7de8af5a38a93548eb8453a498222c4ff2';
    let kyberNetwork = (network == 'live') ? '0x818E6FECD516Ecc3849DAf6845e3EC868087B755' : '0x7e6b8b9510D71BF8EF0f893902EbB9C865eEF4Df';
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
     * Add the executor as an authorised contract to transfer proxy, stake contract, volume subscription & payment registry
    */

    deployer.deploy(TransferProxy).then(function(instance) {
        transferProxy = instance;
        return deployer.deploy(EightExToken);
    }).then(function(instance) {
        eightExToken = instance;
        return deployer.deploy(StakeContract, eightExToken.address);
    }).then(function(instance) {
        stakeContract = instance;
        return deployer.deploy(ApprovedRegistry, kyberNetwork)
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
        return deployer.deploy(Requirements);
    }).then(function(instance) {
        requirementsContract = instance;
        return Promise.all[
            approvedRegistry.addApprovedContract(volumeSubscription.address),
            approvedRegistry.addApprovedToken(wrappedEther.address),
            approvedRegistry.addApprovedToken(daiAddress)
        ];
    }).then(function(instance) {
        return deployer.deploy(
            Executor,
            transferProxy.address,
            stakeContract.address,
            paymentRegistry.address,
            approvedRegistry.address,
            requirementsContract.address,
            800,
            7
        )
    }).then(function(instance) {
        executor = instance;
        return Promise.all[
            transferProxy.addAuthorizedAddress(executor.address),
            stakeContract.addAuthorizedAddress(executor.address),
            paymentRegistry.addAuthorizedAddress(executor.address),
            volumeSubscription.addAuthorizedAddress(executor.address)
        ];
    }).then(function(instance) {
        if (network == 'development') {
            let subscriptionIdentifier;
            let planIdentifier;

            let owner = accounts[0];
            let business = accounts[1];
            let user = accounts[2];
            let serviceNode = accounts[3];

            return volumeSubscription.createPlan(
                business,
                wrappedEther.address,
                "8x.new.plan",
                "",
                "",
                10,
                1*10**18,
                10**17,
                "",
                {from: business}
            ).then(function(result) {
                planIdentifier = result.logs[0].args.identifier;
                console.log(`Plan identifier is: ${planIdentifier}`);
                return volumeSubscription.createSubscription(
                    planIdentifier,
                    "",
                    {from: user}
                );
            }).then(function(result) {
                subscriptionIdentifier = result.logs[0].args.identifier;
                console.log(`Subscription identifier is: ${subscriptionIdentifier}`);
                return wrappedEther.deposit({from: user, value: 10*10**18});
            }).then(function(result) {
                console.log(
                    `Executor.at("${executor.address}").activateSubscription("${volumeSubscription.address}","${subscriptionIdentifier}", {from: "${user}"});`
                );
                return wrappedEther.approve(transferProxy.address, 10*10**18, {from: user});
            }).then(function(result) {
                return eightExToken.transfer(serviceNode, 100*10**18, {from: owner});
            }).then(function(result) {
                return eightExToken.approve(stakeContract.address, 100*10**18, {from: serviceNode})
            }).then(function(result) {
                console.log(
                    `Executor.at("${executor.address}").processSubscription("${volumeSubscription.address}","${subscriptionIdentifier}", {from: "${serviceNode}"});`
                )
                return stakeContract.topUpStake(100*10**18, wrappedEther.address, {from: serviceNode});
            });
        }

        return null;
    }).catch(function(error) {
        console.log("CATCH-ERROR " + error);
    })



};
