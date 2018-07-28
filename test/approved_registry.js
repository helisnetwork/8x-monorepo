import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockExecutor = artifacts.require("./test/MockExecutor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var MockPaymentRegistryContract = artifacts.require("./test/MockPaymentRegistry.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var KyberContract = artifacts.require("./test/MockKyberNetworkInterface.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let paymentRegistryContract;
    let kyberContract;

    let executorContract;
    let nativeTokenContract;
    let wrappedEtherContract;
    let transactingCurrencyContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let etherSubscriber = accounts[2]; // User paying $100/month subscription worth of ETH
    let tokenSubscriber = accounts[3]; // User paying $100/month subscription directly (probably in DAI)
    let serviceNode = accounts[4]; // Collector party claiming payment
    let unauthorisedAddress = accounts[5]; // Some random address

    let planIdentifier;

    let ethPlanHash;
    let etherSubscriptionHash;
    let tokenPlanHash;
    let tokenSubscriptionHash;

    let subscriptionCost = 10*10**18; // $10.00
    let exchangeRate = 2*10**15; // 0.002 ETH/USD
    let subscriptionEthCost = (subscriptionCost * exchangeRate) / (10**18);

    let subscriptionFee = 10**17; // $0.10
    let subscriptionEthFee = (subscriptionFee * exchangeRate) / (10**18);

    let subscriptionInterval = 30 * 24 * 60 * 60; // 30 days
    let multiplier = 10;

    before(async function() {

        // Initialise the 8x token contract, the owner has all the initial token supply.
        nativeTokenContract = await EightExToken.new({from: contractOwner});

        // Initialise a mock token contract, the owner has the initial supply
        wrappedEtherContract = await WrappedEther.new();
        transactingCurrencyContract = await MockToken.new({from: contractOwner});

        // Initialise all the other contracts the executor needs in order to function
        subscriptionContract = await MockVolumeSubscription.new({from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        stakeContract = await StakeContract.new(nativeTokenContract.address, {from: contractOwner});
        paymentRegistryContract = await MockPaymentRegistryContract.new({from: contractOwner});

        // Initialise the Kyber Network contract and give it 1000 DAI
        kyberContract = await KyberContract.new({from: contractOwner});
        transactingCurrencyContract.transfer(kyberContract.address, 1000*10**18, {from: contractOwner});

        // Initialise the executor contract with all it's needed components
        executorContract = await MockExecutor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            kyberContract.address,
            {from: contractOwner}
        );

        // Add the executor contract as an authorised address for all the different components
        subscriptionContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        proxyContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        stakeContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        paymentRegistryContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});

        // Create a new subscription plan
        let newTokenPlan = await subscriptionContract.createPlan(
            business, transactingCurrencyContract.address, "subscription.new.token", "test", "", subscriptionInterval, subscriptionCost, subscriptionFee, "{}", {from: business}
        );

        // The hash that we can use to identify the plan
        tokenPlanHash = newTokenPlan.logs[0].args.identifier;

        // Create a new subscription plan
        let newEthPlan = await subscriptionContract.createPlan(
            business, wrappedEtherContract.address, "subscription.new.ether", "test", "", subscriptionInterval, subscriptionEthCost, subscriptionEthFee, "{}", {from: business}
        );

        // The hash that we can use to identify the plan
        ethPlanHash = newEthPlan.logs[0].args.identifier;

        // Create a new subscription (from a subscriber)
        let newEtherSubscription = await subscriptionContract.createSubscription(
            ethPlanHash, "{}", {from: etherSubscriber}
        );

        let newTokenSubscription = await subscriptionContract.createSubscription(
            tokenPlanHash, "{}", {from: tokenSubscriber}
        );

        // The hash we can use to identify the subscription
        etherSubscriptionHash = newEtherSubscription.logs[0].args.identifier;
        tokenSubscriptionHash = newTokenSubscription.logs[0].args.identifier;

    });

    describe("when adding or removing an approved contract", () => {

        it("should not be able to add a contract as an unauthorised address", async function() {

           await assertRevert(executorContract.addApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a contract as the owner", async function() {

            await executorContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await executorContract.getApprovedContracts();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to add a duplicate contract", async function() {

            await assertRevert(executorContract.addApprovedContract(subscriptionContract.address, {from: contractOwner}));

        });

        it("should not be able to set a contract's call costs as an unauthorised address", async function() {

            await assertRevert(executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: unauthorisedAddress}));

        });

        it("should not be able to set call costs for a contract which isn't already authorised", async function() {

            await assertRevert(executorContract.setApprovedContractCallCost("0xabc", 0, 40, 20, 1, {from: contractOwner}));

        });

        it("should be able to set a contract's call costs as the owner", async function() {

            // Random numbers plugged in here since we're going to be removing these and keeping the state fresh
            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: contractOwner});
            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 1, 30, 10, 1, {from: contractOwner});

            let gasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 40);
            assert.equal(gasCostObject[1], 20);
            assert.equal(gasCostObject[2], 1);

            let secondGasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(secondGasCostObject[0], 30);
            assert.equal(secondGasCostObject[1], 10);
            assert.equal(secondGasCostObject[2], 1);

        });

        it("should not be able to remove a contract's call costs as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract's call costs as an authorised address", async function() {

            // State of approved contracts is reset here, and it's a test!
            await executorContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: contractOwner});
            await executorContract.removeApprovedContractCallCost(subscriptionContract.address, 1, {from: contractOwner});

            let gasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 0);
            assert.equal(gasCostObject[1], 0);
            assert.equal(gasCostObject[2], 0);

            let gasCostObjectTwo = await executorContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(gasCostObjectTwo[0], 0);
            assert.equal(gasCostObjectTwo[1], 0);
            assert.equal(gasCostObjectTwo[2], 0);
        });

        it("should not be able to remove a contract as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract as the owner", async function() {

            await executorContract.removeApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await executorContract.getApprovedContracts();
            assert.equal(approvedArray.length, 0);

        });

    });

    describe("when adding an approved token", () => {

        it("should not be able to add a token as an unauthorised address", async function() {

            await assertRevert(executorContract.addApprovedToken(transactingCurrencyContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a token as an authorised address", async function() {

            // We're only adding the token for now since we want to test duplication + other things
            await executorContract.addApprovedToken(transactingCurrencyContract.address, {from: contractOwner});

            let approvedArray = await executorContract.getApprovedTokens();
            assert.equal(approvedArray.length, 1);

        });

        it("should be able to add a duplicate token as an authorised address", async function() {

            await assertRevert(executorContract.addApprovedToken(transactingCurrencyContract.address, {from: contractOwner}));

        });

        it("should not be able to set the multiplier for an unauthorised token", async function() {

            await assertRevert(executorContract.setApprovedTokenMultiplier(wrappedEtherContract.address, multiplier, {from: contractOwner}));

        });

        it("should be able to set the multiplier as the contract owner", async function() {

            // Adding approved tokens, state will be reset later on. Simply using to test multiplier setting.
            await executorContract.addApprovedToken(wrappedEtherContract.address, {from: contractOwner});

            await executorContract.setApprovedTokenMultiplier(transactingCurrencyContract.address, multiplier, {from: contractOwner});
            await executorContract.setApprovedTokenMultiplier(wrappedEtherContract.address, multiplier, {from: contractOwner});

            let currencyMultiplier = await executorContract.approvedTokenMapping.call(transactingCurrencyContract.address);
            let etherMultiplier = await executorContract.approvedTokenMapping.call(wrappedEtherContract.address);

            // Check the values were actually set rather than relying on a revert
            assert.equal(currencyMultiplier.toNumber(), multiplier);
            assert.equal(etherMultiplier.toNumber(), multiplier);

        });

        it("should not be able to remove a token as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedToken(transactingCurrencyContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to remove a token as an authorised address", async function() {

            // Remove approved tokens to reset the state
            await executorContract.removeApprovedToken(transactingCurrencyContract.address, {from: contractOwner});
            await executorContract.removeApprovedToken(wrappedEtherContract.address, {from: contractOwner});

            let approvedEthObject = await executorContract.approvedTokenMapping.call(wrappedEtherContract.address);
            assert.equal(approvedEthObject, 0);

            let approvedTokenObject = await executorContract.approvedTokenMapping.call(transactingCurrencyContract.address);
            assert.equal(approvedTokenObject, 0);

            let approvedArray = await executorContract.getApprovedTokens();
            assert.equal(approvedArray.length, 0);

        });

    });


});