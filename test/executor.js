import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var Executor = artifacts.require("./Executor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var PaymentRegistryContract = artifacts.require("./PaymentRegistry.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let paymentRegistryContract;

    let executorContract;
    let tokenContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let subscriber = accounts[2]; // User paying $100/month subscription
    let serviceNode = accounts[3]; // Collector party claiming payment
    let unauthorisedAddress = accounts[4]; // Some random address.

    let planIdentifier;

    before(async function() {

        tokenContract = await EightExToken.new({from: contractOwner});

        subscriptionContract = await MockVolumeSubscription.new({from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        stakeContract = await StakeContract.new(tokenContract.address, {from: contractOwner});
        paymentRegistryContract = await PaymentRegistryContract.new({from: contractOwner});

        executorContract = await Executor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            {from: contractOwner}
        );

        subscriptionContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        proxyContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        stakeContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        paymentRegistryContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});

    });

    describe("when adding an approved contract", () =>{

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

    });

    describe("when adding an approved token", () =>{

        it("should not be able to add a token as an unauthorised address", async function() {

            await assertRevert(executorContract.addApprovedToken(tokenContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a token as an authorised address", async function() {

            await executorContract.addApprovedToken(tokenContract.address, {from: contractOwner});

            let isApproved = await executorContract.approvedTokenMapping.call(tokenContract.address);
            assert(isApproved);

            let approvedArray = await executorContract.approvedTokenArray;
            assert.equal(approvedArray.length, 1);

        });

    });

    describe("when businesses creates subscriptions", () => {

        it("should not be able to create a subscription to an unauthorised contract", async function() {

            // @TODO: Implementation

        });

        it("should be able to create a subscription", async function() {

            // @TODO: Implementation

        });

    });

    describe("when users subscribe to subscriptions", () => {

        it("should not be able to subscribe to an unauthorized subscription contract", async function() {

            // @TODO: Implementation

        });

        it("should be have enough allowance to spend from the user's wallet with enough funds", async function() {

            // @TODO: Implementation

        });

        it("should be subscribing to an authorized subscription contract", async function() {

            // @TODO: Implementation

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