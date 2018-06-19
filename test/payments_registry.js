import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';

import { newSubscription } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockTransactionRegistry= artifacts.require('./tests/MockTransactionRegistry.sol');
var EightExToken = artifacts.require("./EightExToken.sol");

contract('MockTransactionRegistry', function(accounts) {

    let transactionRegistry;
    let subscriptionContract;
    let tokenContract;

    let now = Date.now();
    let oneMonthLater = parseInt(now/1000) + (30*24*60*60);
    let twoMonthsLater = parseInt(now/1000) + (60*24*60*60);
    let threeMonthsLater = parseInt(now/1000) + (90*24*60*60);


    before(async function() {

        transactionRegistry = await MockTransactionRegistry.new({from: accounts[0]});
        subscriptionContract = await MockVolumeSubscription.new({from: accounts[0]});
        tokenContract = await EightExToken.new({from: accounts[0]});

        // Add accounts[0] as an authorized address
        await transactionRegistry.addAuthorizedAddress(accounts[0], {from: accounts[0]});

    });

    describe("basic tests", () => {

        it("should throw if someone other than the owner tries to set the multiplier", async function() {

            await assertRevert(transactionRegistry.setMultiplier(2, {from: accounts[1]}));

        });

        it("should be able to set the multiplier as the owner", async function() {

            await transactionRegistry.setMultiplier(1, {from: accounts[0]});

            let multiplier = await transactionRegistry.multiplier.call();
            assert.equal(multiplier, 1);

        });


    })

    describe("when creating a new payment", () => {

        let future = parseInt(now/1000) + (30*24*60*60);

        it("should not be able to create with invalid details", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.invalid.details", {from: accounts[0]});

            await assertRevert(transactionRegistry.createNewPayment("abc", subscriptionContract.address, future, 400, {from: accounts[0]}));
            await assertRevert(transactionRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, now - 1000, 400, {from: accounts[0]}));
            await assertRevert(transactionRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, future, 0, {from: accounts[0]}));

        });

        it("should not be able to create as an unauthorized address", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.unauthorized");
            await assertRevert(transactionRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[1]}));

        });

        it("should be able to create a valid new payment", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.valid");
            let result = await transactionRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[0]});
            assert.equal(result, true);

        });

    });

    describe("when processing a payment", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "process.valid");
            result = await transactionRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, oneMonthLater, 400, {from: accounts[0]});
        });

        it("should not able to execute for a subscription that doesn't exist", async function() {

            await assertRevert(transactionRegistry.processPayment("abc", {from: accounts[0]}));

        });

        it("should not be able to set the duedate in the past", async function() {

            let past = parseInt(now/1000) - 10;
            await assertRevert(transactionRegistry.processPayment(subscriptionHash, {from: accounts[0]}))

        });


        it("should throw if being called from an unauthorized address", async function() {

            await assertRevert(transactionRegistry.processPayment(subscriptionHash, {from: accounts[1]}));

        });

        it("should throw if trying to process before the payment is due", async function() {

            let dayBeforeOneMonth = oneMonthLater - (1*24*60*60);
            await transactionRegistry.setTime(dayBeforeOneMonth);
            await assertRevert(transactionRegistry.processPayment(subscriptionHash, {from: accounts[0]}));

        });

        it("should be able to process correctly", async function() {

            let tenSecondsfterOneMonth = oneMonthLater + 10;

            // We're setting the time to 10 seconds after the payment due date to set the claim period
            await transactionRegistry.setTime(tenSecondsfterOneMonth);

            // Then we process the payment by passing the subscription identifier
            let result = await transactionRegistry.processPayment(subscriptionHash, {from: accounts[0]});

            assert.equal(result, true);

            // Get the payment information to check that it's been set correctly
            let paymentInformation = await transactionRegistry.getPaymentInformation(subscriptionHash);
            assert.equal(paymentInformation[4], accounts[0]);
            assert.equal(paymentInformation[5], 10);

        });

        it('should return false if executing a payment after the specified execution period', async function() {

            await transactionRegistry.setTime(twoMonthsLater);
            let thirtySecondsAfterTwoMonths = twoMonthsLater + 30;
            await assertRevert(transactionRegistry.processPayment(subscriptionHash, {from: accounts[0]}));
            assert.equal(result, false);

        });

        it('should return true if executing a payment within the specified execution date', async function() {

            await transactionRegistry.setTime(twoMonthsLater);
            let thirtySecondsAfterTwoMonths = twoMonthsLater + 10;
            let result = await transactionRegistry.processPayment(subscriptionHash, {from: accounts[0]});
            assert.equal(result, true);

        });

    });

    describe("when removing a claimant", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "remove");
            result = await transactionRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, oneMonthLater, 400, {from: accounts[0]});
        });

        it("should throw if being called from an unuthorized address", async function() {

            await assertRevert(transactionRegistry.removeClaimant(subscriptionHash, {from: accounts[1]}));

        });

        it("should be able to remove a claimant", async function() {

            await transactionRegistry.removeClaimant(subscriptionHash, {from: accounts[0]});
            assert.equal(transactionRegistry.logs[0].args.identifier, subscriptionHash);

        });

    });

    describe("when cancelling a payment", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "cancel");
            result = await transactionRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, oneMonthLater, 400, {from: accounts[0]});
        });

        it('should throw if being called from an unauthorized address', async function() {

            await assertRevert(transactionRegistry.cancelPayment(subscriptionHash, {from: accounts[1]}));

        });

        it("should be able to cancel a payment", async function() {

            let result = await transactionRegistry.cancelPayment(subscriptionHash, {from: accounts[0]});
            assert.equal(result, true);

        });

    });

});