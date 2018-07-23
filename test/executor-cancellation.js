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