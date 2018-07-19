import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var Executor = artifacts.require("./Executor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var PaymentRegistryContract = artifacts.require("./PaymentRegistry.sol");
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
    let unauthorisedAddress = accounts[4]; // Some random address.

    let planIdentifier;

    let planHash;
    let subscriptionHash;

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
            business, mockTokenContract.address, "subscription.cancel", "test", "", 30, 100, 10, "{}", {from: business}
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

    describe("basic tests", () => {

        it("should throw if someone other than the owner tries to set the multiplier", async function() {

            await assertRevert(paymentRegistry.updateMultiplier(2, {from: contractOwner}));

        });

        it("should be able to set the multiplier as the owner", async function() {

            await paymentRegistry.updateMultiplier(1, {from: contractOwner});

            let multiplier = await paymentRegistry.currentMultiplier.call();
            assert.equal(multiplier.toNumber(), 1);

        });

    })

    describe("when adding or removing an approved contract", () => {

        it("should not be able to add a contract as an unauthorised address", async function() {

           await assertRevert(executorContract.addApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a contract as an authorised address", async function() {

            await executorContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});

            let isApproved = await executorContract.approvedContractMapping.call(subscriptionContract.address);
            assert(isApproved);

            let approvedArray = await executorContract.approvedContractArray;
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to set a contract's call costs as an unauthorised address", async function() {

            // @TODO: Implementation

        });

        it("should be able to set a contract's call costs as an authorised address", async function() {

            // @TODO: Implementation

        });


        it("should not be able to remove a contract as an unauthorised address", async function() {

            // @TODO: Implementation

        });


        it("should be able to remove a contract as an authorised address", async function() {

            // @TODO: Implementation

        });

        it("should not be able to remove a contract's call costs as an unauthorised address", async function() {

            // @TODO: Implementation

        });

        it("should be able to remove a contract's call costs as an authorised address", async function() {

            // @TODO: Implementation

        });

    });

    describe("when adding an approved token", () => {

        it("should not be able to add a token as an unauthorised address", async function() {

            await assertRevert(executorContract.addApprovedToken(mockTokenContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a token as an authorised address", async function() {

            await executorContract.addApprovedToken(mockTokenContract.address, {from: contractOwner});

            let isApproved = await executorContract.approvedTokenMapping.call(mockTokenContract.address);
            assert(isApproved);

            let approvedArray = await executorContract.approvedTokenArray;
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to remove a token as an unauthorised address", async function() {

            // @TODO: Implementation

        });

        it("should be able to remove a token as an authorised address", async function() {

            // @TODO: Implementation

        });

    });

    describe("when users activate subscriptions", () => {

        it("should not be able to subscribe to an unauthorized subscription contract", async function() {

            let fakeSubscriptionContract = await MockVolumeSubscription.new({from: contractOwner});

            let fakePlan = await fakeSubscriptionContract.createPlan(
                business, token.address, "subscription.cancel", "test", "", 30, 100, 10, "{}", {from: business}
            );

            let fakePlanHash = fakePlan.logs[0].args.identifier;

            await assertRevert(executorContract.activateSubscription(fakeSubscriptionContract.address, fakePlanHash, {from: subscriber}));

        });

        it("should not be able to subscribe to a plan with an unauthorised token contract", async function() {

            // @TODO: Implementation
            // Might need to implement this check in the create plan function in Volume Subscription.

        });

        it("should not be able to activate a subscription without enough funds", async function() {

            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, subscriptionHash, {from: subscriber}));

        });

        it("should be able to subscribe to an authorized subscription contract", async function() {

            // Transfer 10 extra for gas fees
            // @ TODO: Figure out how to handle gas costs...
            await contractOwner.transfer(subscriber, 110);
            await executorContract.activateSubscription(subscriptionContract.address, subscriptionHash, {from: subscriber});

            let subscription = await subscriptionContract.subscriptions.call(subscriptionHash);
            assert.isAbove(subscription[3], 0); // See if the start date has been set (subcription activated)

            let balance = await mockTokenContract.balanceOf(subscriber);
            // @ TODO: Figure out how to handle gas costs accurately
            assert.isBelow(balance.toNumber(), 11)

        });

        it("should not be able subscribe if it has already been activated", async function() {

            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, subscriptionHash, {from: subscriber}));

        });

    });

    describe("when service nodes process subscriptions", () => {

        it("should have enough funds in the user's wallet including gas cost", async function() {

            // @TODO: Implementation

        });

        it("should be able to process a valid subscription", async function() {

            // @TODO: Implementation

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