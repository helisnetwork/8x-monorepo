import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var Executor = artifacts.require("./Executor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let executorContract;
    let proxyContract;
    let tokenContract;

    let firstAccount = accounts[0]; // Admin role
    let secondAccount = accounts[1]; // Plan owner that has a plan that costs $10/month
    let thirdAccount = accounts[2]; // User paying $100/month subscription
    let fourthAccount = accounts[3]; // Collector party claiming payment
    let fifthAccount = accounts[4]; // Third party claiming payment

    let planIdentifier;

    before(async function() {

        subscriptionContract = await MockVolumeSubscription.new({from: firstAccount});
        executorContract = await Executor.new({from: firstAccount});
        proxyContract = await TransferProxy.new({from: firstAccount});
        tokenContract = await EightExToken.new({from: firstAccount});

        // Set proxy in executor contract
        executorContract.setTransferProxy(proxyContract.address);

        // Add executor as as authorized to proxy contract
        // Add executor as as authorized to subscription contract
        await subscriptionContract.addAuthorizedAddress(executorContract.address, {from: firstAccount});
        await proxyContract.addAuthorizedAddress(executorContract.address, {from: firstAccount});

        // Transfer tokens to third account
        await tokenContract.transfer(thirdAccount, 100, {from: firstAccount});

        // Create a plan that costs $100/month
        let newPlan = await subscriptionContract.createPlan(secondAccount, tokenContract.address, "test", "product", "n/a", 30, 100, 10, "", {from: secondAccount});
        planIdentifier = newPlan.logs[0].args.identifier;

        // Make the user give permission to the proxy to transfer tokens on it's behalf
        await tokenContract.approve(proxyContract.address, 100, {from: thirdAccount});

    });

    describe("when the company is eligible to collect a payment", () => {

        it("should be able to collect it", async function() {

            let allowance = await tokenContract.allowance(thirdAccount, proxyContract.address);

            // @TODO (MAJOR) - Should not allow user to create subscription directly. It should route through the executor.

            let now = Date.now();
            now = now/1000;

            // Make the user subscribe to the plan
            let newSubscription = await subscriptionContract.createSubscription(thirdAccount, planIdentifier, now, "", {from: thirdAccount});
            let subscriptionIdentifier = newSubscription.logs[0].args.identifier;

            await executorContract.collectPayment(subscriptionContract.address, subscriptionIdentifier, {from: fourthAccount});

            let collectorAfterBalance = await tokenContract.balanceOf(fourthAccount);
            let planOwnerAfterBalance = await tokenContract.balanceOf(secondAccount);
            let userAfterBalance = await tokenContract.balanceOf(thirdAccount);

            // @TODO: This should be for the actual fee itself from the subscription
            assert.equal(1, collectorAfterBalance.toNumber()); // The collector should get their 1% cut
            assert.equal(99, planOwnerAfterBalance.toNumber()); // The plan owner should get the remaining sum
            assert.equal(0, userAfterBalance.toNumber()); // The end user should have no tokens left

            // @TODO: Last payment date should be updated
            // @TODO: Handle time based logic

        });

        it("should not be able to collect it earlier than the time", async function() {

            // @TODO: Handle time based logic
            assert.fail("Not implemented");

        });

        it("should be able to cancel the subscription if the user doesn't have enough funds", async function() {

            // @TODO: Handle time based logic
            assert.fail("Not implemented");

        });

        it("should be able to cancel the subscription if the user didn't pay in the last cycle", async function() {

            // @TODO: Handle time based logic
            assert.fail("Not implemented");

        });

    });

    describe("when the a third party is eligible to collect a payment", () => {

        // @TODO: Handle time based logic

    });

});