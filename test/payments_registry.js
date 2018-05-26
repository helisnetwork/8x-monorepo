import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';

import { newSubscription } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockPaymentsRegistry= artifacts.require('./tests/MockPaymentsRegistry.sol');
var EightExToken = artifacts.require("./EightExToken.sol");

contract('MockPaymentsRegistry', function(accounts) {

    let paymentsRegistry;
    let subscriptionContract;
    let tokenContract;

    let now = Date.now();
    let oneMonthLater = parseInt(now/1000) + (30*24*60*60);
    let twoMonthsLater = parseInt(now/1000) + (60*24*60*60);
    let threeMonthsLater = parseInt(now/1000) + (90*24*60*60);


    before(async function() {

        paymentsRegistry = await MockPaymentsRegistry.new({from: accounts[0]});
        subscriptionContract = await MockVolumeSubscription.new({from: accounts[0]});
        tokenContract = await EightExToken.new({from: accounts[0]});

        // Add accounts[0] as an authorized address
        await paymentsRegistry.addAuthorizedAddress(accounts[0], {from: accounts[0]});

    });

    describe("basic tests", () => {

        it("should throw if someone other than the owner tries to set the multiplier", async function() {

            await assertRevert(paymentsRegistry.setMultiplier(2, {from: accounts[1]}));

        });

        it("should be able to set the multiplier as the owner", async function() {

            await paymentsRegistry.setMultiplier(1, {from: accounts[0]});

            let multiplier = await paymentsRegistry.multiplier.call();
            assert.equal(multiplier, 1);

        });
    

    })

    describe("when creating a new payment", () => {

        let future = parseInt(now/1000) + (30*24*60*60);

        it("should not be able to create with invalid details", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.invalid.details", {from: accounts[0]});

            await assertRevert(paymentsRegistry.createNewPayment("abc", subscriptionContract.address, future, 400, {from: accounts[0]}));
            await assertRevert(paymentsRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, now - 1000, 400, {from: accounts[0]}));
            await assertRevert(paymentsRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, future, 0, {from: accounts[0]}));

        });

        it("should not be able to create as an unauthorized address", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.unauthorized");
            await assertRevert(paymentsRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[1]})); 

        });

        it("should be able to create a valid new payment", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.valid");
            let result = await paymentsRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[0]});
            assert(result);

        });

    });

    describe("when processing a payment", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "process.valid");
            result = await paymentsRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, oneMonthLater, 400, {from: accounts[0]});
        });
        
        it("should not able to execute for a subscription that doesn't exist", async function() {

            await assertRevert(paymentsRegistry.processPayment("abc", twoMonthsLater, 400, {from: accounts[0]}));

        });

        it("should not be able to set the duedate in the past", async function() {

            let past = parseInt(now/1000) - 10;
            await assertRevert(paymentsRegistry.processPayment(subscriptionHash, twoMonthsLater, 400, {from: accounts[0]}))

        });


        it("should throw if being called from an unauthorized address", async function() {

            await assertRevert(paymentsRegistry.processPayment(subscriptionHash, twoMonthsLater, 400, {from: accounts[1]}));

        });

        it("should throw if trying to process before the payment is due", async function() {

            let dayBeforeOneMonth = oneMonthLater - (1*24*60*60);
            await paymentsRegistry.setTime(dayBeforeOneMonth);
            await assertRevert(paymentsRegistry.processPayment(subscriptionHash, twoMonthsLater, 400, {from: accounts[0]}));

        });

        it("should be able to process correctly", async function() {

            let tenSecondsfterOneMonth = oneMonthLater + 10;
            await paymentsRegistry.setTime(tenSecondsfterOneMonth);
            let result = await paymentsRegistry.processPayment(subscriptionHash, twoMonthsLater, 400, {from: accounts[0]});

            // @TODO: We need to make sure that the claimant is set and the execution period is calculated properly.
            // @TODO: Check for the success return parameter.
            assert(result._success);

        });

        it('should return false if executing a payment after the specified execution period', async function() {

            await paymentsRegistry.setTime(twoMonthsLater);
            let thirtySecondsAfterTwoMonths = twoMonthsLater + 30;
            await assertRevert(paymentsRegistry.processPayment(subscriptionHash, threeMonthsLater, 400, {from: accounts[0]}));
            assert(!result);

        });

        it('should return true if executing a payment within the specified execution date', async function() {

            await paymentsRegistry.setTime(twoMonthsLater);
            let thirtySecondsAfterTwoMonths = twoMonthsLater + 10;
            let result = await paymentsRegistry.processPayment(subscriptionHash, threeMonthsLater, 400, {from: accounts[0]});
            // @TODO: Check for the success return parameter.
            assert(!result);

        });

    });

    describe("when removing a claimant", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "remove");
            result = await paymentsRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, oneMonthLater, 400, {from: accounts[0]});
        });
    
        it("should throw if being called from an unuthorized address", async function() {

            await assertRevert(paymentsRegistry.removeClaimant(subscriptionHash, {from: accounts[1]}));

        });

        it("should be able to remove a claimant", async function() {

            await paymentsRegistry.removeClaimant(subscriptionHash, {from: accounts[0]});
            // @TODO: Check the logs for the claimant removed log event.

        });
    
    });

    describe("when cancelling a payment", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "cancel");
            result = await paymentsRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, oneMonthLater, 400, {from: accounts[0]});
        });

        it('should throw if being called from an unauthorized address', async function() {

            await assertRevert(paymentsRegistry.cancelPayment(subscriptionHash, {from: accounts[1]}));

        });

        it("should be able to cancel a payment", async function() {

            let result = await paymentsRegistry.cancelPayment(subscriptionHash, {from: accounts[0]});
            // @TODO: Check for the success return parameter.
            assert(result);

        });

    });

});