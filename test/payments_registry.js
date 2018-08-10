import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';

import { newSubscription } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockPaymentRegistry= artifacts.require('./tests/MockPaymentRegistry.sol');
var EightExToken = artifacts.require("./EightExToken.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");

contract('MockPaymentRegistry', function(accounts) {

    let paymentRegistry;
    let subscriptionContract;
    let tokenContract;
    let approvedRegistryContract;

    let now = Date.now();
    let oneMonthLater = parseInt(now/1000) + (30*24*60*60);
    let twoMonthsLater = parseInt(now/1000) + (60*24*60*60);
    let threeMonthsLater = parseInt(now/1000) + (90*24*60*60);


    before(async function() {

        paymentRegistry = await MockPaymentRegistry.new({from: accounts[0]});
        approvedRegistryContract = await ApprovedRegistry.new({from: accounts[0]});
        subscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: accounts[0]});
        tokenContract = await EightExToken.new({from: accounts[0]});

        // Add accounts[0] as an authorized address
        await paymentRegistry.addAuthorizedAddress(accounts[0], {from: accounts[0]});

        await approvedRegistryContract.addApprovedContract(subscriptionContract.address, {from: accounts[0]});
        await approvedRegistryContract.addApprovedToken(tokenContract.address, {from: accounts[0]});

    });

    describe("when creating a new payment", () => {

        it("should not be able to create with invalid details", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.invalid.details", {from: accounts[0]});

            await assertRevert(paymentRegistry.createNewPayment("", tokenContract.address, oneMonthLater, 400, 4, {from: accounts[0]}));
            await assertRevert(paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, (now/1000) - 100, 400, 4, {from: accounts[0]}));
            await assertRevert(paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, oneMonthLater, 0, 4, {from: accounts[0]}));
            await assertRevert(paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, oneMonthLater, 400, 0, {from: accounts[0]}));

        });

        it("should not be able to create as an unauthorized address", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.unauthorized");
            await assertRevert(paymentRegistry.createNewPayment(subscriptionHash, subscriptionContract.address, oneMonthLater, 400, 4, {from: accounts[1]}));

        });

        it("should be able to create a valid new payment", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "create.valid");
            let result = await paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, oneMonthLater, 400, 4, {from: accounts[0]});

            let firstPayment = await paymentRegistry.payments.call(subscriptionHash);
            assert.equal(firstPayment[0], tokenContract.address);
            assert.equal(firstPayment[1].toNumber(), oneMonthLater);
            assert.equal(firstPayment[2].toNumber(), 400);
            assert.equal(firstPayment[3].toNumber(), 4);

        });

    });

    describe("when claiming a payment", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "process.valid");
            result = await paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, oneMonthLater, 400, 4, {from: accounts[0]});
        });

        it("should throw if being called from an unauthorized address", async function() {

            await assertRevert(paymentRegistry.claimPayment(subscriptionHash, accounts[1], twoMonthsLater, 10, {from: accounts[1]}));

        });

        it("should throw if stake multiplier is set to zero", async function() {

            await assertRevert(paymentRegistry.claimPayment(subscriptionHash, accounts[1], twoMonthsLater, 0, {from: accounts[0]}));

        });

        it("should throw if trying to process before the payment is due", async function() {

            let dayBeforeOneMonth = oneMonthLater - (1*24*60*60);
            await paymentRegistry.setTime(dayBeforeOneMonth);
            await assertRevert(paymentRegistry.claimPayment(subscriptionHash, accounts[1], twoMonthsLater, 10, {from: accounts[0]}));

        });

        it("should be able to claim correctly", async function() {

            let tenSecondsfterOneMonth = oneMonthLater + 10;

            // We're setting the time to 10 seconds after the payment due date to set the claim period
            await paymentRegistry.setTime(tenSecondsfterOneMonth);

            // Then we process the payment by passing the subscription identifier
            let result = await paymentRegistry.claimPayment(subscriptionHash, accounts[1], twoMonthsLater, 10, {from: accounts[0]});

            // Get the payment information to check that it's been set correctly
            let paymentInformation = await paymentRegistry.payments.call(subscriptionHash);

            assert.equal(paymentInformation[1].toNumber(), twoMonthsLater);
            assert.equal(paymentInformation[5], accounts[1]);
            assert.equal(paymentInformation[6].toNumber(), 10);
            assert.equal(paymentInformation[7].toNumber(), 10);

        });

        it('should throw if executing a payment after the specified execution period', async function() {

            let thirtySecondsAfterTwoMonths = twoMonthsLater + 30;
            await paymentRegistry.setTime(thirtySecondsAfterTwoMonths);
            await assertRevert(paymentRegistry.claimPayment(subscriptionHash, accounts[1], threeMonthsLater, 10, {from: accounts[0]}));

        });

        it('should return true if executing a payment at the end of the specified execution date', async function() {

            let tenSecondsAfterTwoMonths = twoMonthsLater + 10;
            await paymentRegistry.setTime(tenSecondsAfterTwoMonths);
            let result = await paymentRegistry.claimPayment(subscriptionHash, accounts[1], threeMonthsLater, 10, {from: accounts[0]});

            // Get the payment information to check that it's been set correctly
            let paymentInformation = await paymentRegistry.payments.call(subscriptionHash);
            assert.equal(paymentInformation[1].toNumber(), threeMonthsLater);
            assert.equal(paymentInformation[4].toNumber(), tenSecondsAfterTwoMonths);
        });

    });

    describe("when removing a claimant", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            await paymentRegistry.setTime(now/1000);

            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "remove.claimant");
            result = await paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, oneMonthLater, 400, 4, {from: accounts[0]});

            let tenSecondsfterOneMonth = oneMonthLater + 10;
            await paymentRegistry.setTime(tenSecondsfterOneMonth);
            await paymentRegistry.claimPayment(subscriptionHash, accounts[1], twoMonthsLater, 10, {from: accounts[0]});

        });

        it("should throw if being called from an unuthorized address", async function() {

            await assertRevert(paymentRegistry.removeClaimant(subscriptionHash, accounts[1], {from: accounts[1]}));

        });

        it("should be able to remove a claimant", async function() {

            await paymentRegistry.removeClaimant(subscriptionHash, accounts[1], {from: accounts[0]});
            let paymentInformation = await paymentRegistry.payments.call(subscriptionHash);

            assert.equal(paymentInformation[5], 0);
            assert.equal(paymentInformation[6], 0);

        });

    });

    describe("when cancelling a payment", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "cancel");
            result = await paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, twoMonthsLater, 400, 4, {from: accounts[0]});
        });

        it('should throw if being called from an unauthorized address', async function() {

            await assertRevert(paymentRegistry.cancelPayment(subscriptionHash, {from: accounts[1]}));

        });

        it("should be able to cancel a payment", async function() {

            let result = await paymentRegistry.cancelPayment(subscriptionHash, {from: accounts[0]});
            let paymentInformation = await paymentRegistry.payments.call(subscriptionHash);
            assert.equal(paymentInformation[0], 0);

        });

    });

    describe("when deleting a payment", () => {

        let subscriptionHash;
        let result;

        before(async function() {
            subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "delete");
            result = await paymentRegistry.createNewPayment(subscriptionHash, tokenContract.address, twoMonthsLater, 400, 4, {from: accounts[0]});
        });

        it('should throw if being called from an unauthorized address', async function() {

            await assertRevert(paymentRegistry.deletePayment(subscriptionHash, {from: accounts[1]}));

        });

        it("should be able to delete a payment", async function() {

            let result = await paymentRegistry.cancelPayment(subscriptionHash, {from: accounts[0]});
            let paymentInformation = await paymentRegistry.payments.call(subscriptionHash);
            assert.equal(paymentInformation[0], 0);
            assert.equal(paymentInformation[1], 0);
            assert.equal(paymentInformation[2], 0);
            assert.equal(paymentInformation[3], 0);
            assert.equal(paymentInformation[4], 0);
            assert.equal(paymentInformation[5], 0);
            assert.equal(paymentInformation[6], 0);
            assert.equal(paymentInformation[7], 0);

        });

    });

});