import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var Executor = artifacts.require("./test/MockExecutor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var PaymentRegistryContract = artifacts.require("./test/PaymentRegistry.sol");
var MockToken = artifacts.require("./test/MockToken.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let paymentRegistryContract;

    let executorContract;
    let nativeTokenContract;
    let mockTokenContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let subscriber = accounts[2]; // User paying $100/month subscription
    let serviceNode = accounts[3]; // Collector party claiming payment
    let unauthorisedAddress = accounts[4]; // Some random address
    let competingServiceNode = accounts[5]; // Another collector party claiming payment

    let planIdentifier;

    let planHash;
    let subscriptionHash;

    let subscriptionCost = 10*10**18; // $10.00
    let subscriptionFee = 10**17; // $0.10
    let subscriptionInterval = 30 * 24 * 60 * 60;

    before(async function() {

        // Initialise the 8x token contract, the owner has all the initial token supply.
        nativeTokenContract = await EightExToken.new({from: contractOwner});

        // Initialise a mock token contract, the owner has the initial supply
        mockTokenContract = await MockToken.new({from: contractOwner});

        // Initialise all the other contracts the executor needs in order to function
        subscriptionContract = await MockVolumeSubscription.new({from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        stakeContract = await StakeContract.new(nativeTokenContract.address, {from: contractOwner});
        paymentRegistryContract = await PaymentRegistryContract.new({from: contractOwner});

        // Initialise the executor contract with all it's needed components
        executorContract = await Executor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            {from: contractOwner}
        );

        // Add the executor contract as an authorised address for all the different components
        subscriptionContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        proxyContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        stakeContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        paymentRegistryContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});

        // Create a new subscription plan
        let newPlan = await subscriptionContract.createPlan(
            business, mockTokenContract.address, "subscription.new", "test", "", subscriptionInterval, subscriptionCost, subscriptionFee, "{}", {from: business}
        );

        // The hash that we can use to identify the plan
        planHash = newPlan.logs[0].args.identifier;

        // Create a new subscription (from a subscriber)
        let newSubscription = await subscriptionContract.createSubscription(
            planHash, "{}", {from: subscriber}
        );

        // The hash we can use to identify the subscription
        subscriptionHash = newSubscription.logs[0].args.identifier;

    });


    describe("when service nodes process subscriptions", () => {

        let oneMonthLater = activationTime + subscriptionInterval;

        before(async function() {

            // Set the time forward by one month
            await executorContract.setTime(oneMonthLater);
            await paymentRegistryContract.setTime(oneMonthLater);

            // Transfer some enough tokens for cost and fee for the service node
            await mockTokenContract.transfer(subscriber, subscriptionCost, + subscriptionFee, {from: contractOwner});

            // Top up the user's account with funds for the next payment
            await mockTokenContract.transfer(subscriber, subscriptionCost + fee, {from: contractOwner});

        });

        it("should not be able to process an inactive subscription", async function() {

            // This will have a different hash since the timestamp is different
            let inactiveSubscription = await subscriptionContract.createSubscription(
                planHash, "{}", {from: subscriber}
            );

            // The hash we can use to identify the subscription
            let inactiveSubscriptionHash = newSubscription.logs[0].args.identifier;

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, inactiveSubscriptionHash, {from: serviceNode}));

        });

        it("should not be able to process a subscription before the due date", async function() {

            // Set the time right before the due date
            await executorContract.turnBackTime(5);

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, subscriptionHash, {from: serviceNode}));

            await executorContract.turnBackTime(-5);

        });

        it("should not be able to process a subscription if the service node does not have any staked tokens", async function() {

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, subscriptionHash, {from: serviceNode}));

        });

        it("should not be able to process a subscription if the service node does not have enough staked tokens", async function() {

            // Transfer $10 * 10 (multiplier) worth of 8x tokens
            let amount = (subscriptionCost * 10);
            await nativeTokenContract.transfer(serviceNode,  amount, {from: contractOwner});

            // Approve the stake contract to take 8x tokens from you
            await nativeTokenContract.approve(stakeContract.address, amount, {from: serviceNode});

            // Top up your stake in the stake contract less 100
            await stakeContract.topUpStake(amount - 1000, {from: serviceNode});

            // Check the balance to ensure it topped up the correct amount
            let balance = await stakeContract.getAvailableStake(serviceNode.address);
            assert.equal(balance, amount - 1000);

            // Should fail when collecting payment since there aren't enough tokens
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, subscriptionHash, {from: serviceNode}));

        });

        it("should be able to process a valid subscription", async function() {

            // Check to ensure the user has enough funds
            let preUserBalance = await mockTokenContract.balanceOf(subscriber);
            assert.equal(preUserBalance.toNumber(), subscriptionCost + subscriptionFee);

            // Top up stake by difference
            await stakeContract.topUpStake(1000, {from: serviceNode});

            // Check the balance to ensure it topped up the correct amount
            let balance = await stakeContract.getAvailableStake(serviceNode.address);
            assert.equal(balance, amount);

            // Should be able to process now that the service node has enough staked tokens
            await executorContract.collectPayment(subscriptionContract.address, subscriptionHash, {from: serviceNode});

            // Check the payments registry has been updated
            let paymentInformation = await paymentRegistryContract.payments.call(subscriptionHash);

            assert.equal(paymentInformation[0], subscriptionContract.address);
            assert.equal(paymentInformation[1], oneMonthLater + subscriptionInterval);
            assert.equal(paymentInformation[2], subscriptionCost);
            assert.equal(paymentInformation[3], oneMonthLater);
            assert.equal(paymentInformation[4], serviceNode);
            assert.equal(paymentInformation[5], 0); // We claimed it straight away
            assert.equal(paymentInformation[6], 10);

            // Check if the service node got their reward, gas costs reimbursed and tokens locked up
            // @TODO: Value for gas needs to be reimbursed
            let serviceNodeStakeBalance = await stakeContract.getAvailableStake(serviceNode);
            let serviceNodeTokenBalance = await mockTokenContract.balanceOf(serviceNode);

            assert.equal(serviceNodeStakeBalance.toNumber(), 0);
            assert.equal(serviceNodeTokenBalance.toNumber(), subscriptionFee);

            // Check if the balance of the user was subtracted
            let postUserBalance = await mockTokenContract.balanceOf(subscriber);
            assert.equal(postUserBalance.toNumber(), 0);

            // Check if the businesses' account was credited
            let postBusinessBalance = await mockTokenContract.balanceOf(business);
            assert.equal(postBusinessBalance.toNumber(), (subscriptionCost - fee) * 2);

        });

        it("should not be able to process a subscription once it has already been processed", async function() {

            // Transfer $10 * 10 (multiplier) worth of 8x tokens
            let amount = (subscriptionCost * 10);
            await nativeTokenContract.transfer(competingServiceNode,  amount, {from: contractOwner});

            // Approve the stake contract to take 8x tokens from you
            await nativeTokenContract.approve(stakeContract.address, amount, {from: competingServiceNode});

            // Top up your stake in the stake contract less 100
            await stakeContract.topUpStake(amount, {from: competingServiceNode});

            // Check the balance to ensure it topped up the correct amount
            let balance = await stakeContract.getAvailableStake(competingServiceNode.address);
            assert.equal(balance, amount);

            // Should fail when collecting payment since it has already been claimed/processed
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, subscriptionHash, {from: competingServiceNode}));

        });

    });

    describe("when service nodes cancel a subscription", () => {

        it("should not be able to if the due date has already passed", async function() {

            // @TODO: Implementation

        });

        it("should be able to before the due date", async function() {

            // @TODO: Implementation

        });

    });

    describe("when businesses cancel a subscription", () => {

        it("should not be able to cancel to an unauthorised subscription contract", async function() {

            // @TODO: Protocol

        });

        it("should not be able to as an unauthorised user", async function() {

            // @TODO: Implementation

        });

    });

    describe("when users don't have enough funds in their wallet", () => {

        it("should not allow the subscription to be processed", async function() {

            // @TODO: Implementation

        });

        it("should cancel the subscription", async function() {

            // @TODO: Implementation

        });

    });

});