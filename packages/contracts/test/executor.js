import web3 from 'web3';

import assertRevert from './helpers/assert_revert.js';
import { newPlan, newSubscription, newActiveSubscription, setTimes } from './helpers/volume_subscription.js';
import * as Payroll from './helpers/payroll.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockPayrollSubscription = artifacts.require("./tests/MockPayrollSubscription.sol");
var MockExecutor = artifacts.require("./test/MockExecutor.sol");
var KyberContract = artifacts.require("./test/MockKyberNetwork.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var MockPaymentRegistryContract = artifacts.require("./test/MockPaymentRegistry.sol");

var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let payrollContract;
    let proxyContract;
    let stakeContract;
    let kyberContract;
    let paymentRegistryContract;
    let approvedRegistryContract;

    let executorContract;
    let nativeTokenContract;
    let tokenContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let tokenSubscriber = accounts[2]; // User paying $100/month subscription worth of ETH
    let serviceNode = accounts[3]; // Collector party claiming payment
    let unauthorisedAddress = accounts[4]; // Some random address
    let competingServiceNode = accounts[5]; // Another collector party claiming payment

    let subscriptionCost = 10 * 10 ** 18; // $10.00
    let subscriptionFee = 2 * 10 ** 17; // $0.20

    let exchangeRate = 2 * 10 ** 15; // 0.002 ETH/USD
    let subscriptionInterval = 30 * 24 * 60 * 60; // 30 days

    let divideBy = 10;

    let firstNodeStake = 1000;
    let secondNodeStake = 1000;

    let modifyTimeContracts;

    before(async function() {

        // Initialise a mock token contract, the owner has the initial supply
        tokenContract = await MockToken.new({ from: contractOwner });

        // Initialise the Kyber Network contract and give it 1000 DAI
        kyberContract = await KyberContract.new({ from: contractOwner });
        await tokenContract.transfer(kyberContract.address, 1000 * 10 ** 18, { from: contractOwner });

        // Initialise the approved registry
        approvedRegistryContract = await ApprovedRegistry.new(kyberContract.address, { from: contractOwner });

        // Initialise the 8x token contract, the owner has all the initial token supply.
        nativeTokenContract = await EightExToken.new({ from: contractOwner });

        // Initialise all the other contracts the executor needs in order to function
        subscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, { from: contractOwner });
        payrollContract = await MockPayrollSubscription.new(approvedRegistryContract.address, { from: contractOwner });
        proxyContract = await TransferProxy.new({ from: contractOwner });
        paymentRegistryContract = await MockPaymentRegistryContract.new({ from: contractOwner });

        // Setup the stake contract
        stakeContract = await StakeContract.new(nativeTokenContract.address, { from: contractOwner });

        // Initialise the executor contract with all it's needed components
        executorContract = await MockExecutor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            approvedRegistryContract.address,
            7, { from: contractOwner }
        );

        // Add the executor contract as an authorised address for all the different components
        await subscriptionContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });
        await payrollContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });
        await proxyContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });
        await stakeContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });
        await paymentRegistryContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });

        // We need to add the token contract and token contract to the approved list
        await approvedRegistryContract.addApprovedToken(tokenContract.address, false, { from: contractOwner });

        // Make sure the relevant contracts and tokens have been authorised
        await approvedRegistryContract.addApprovedContract(subscriptionContract.address, { from: contractOwner });
        await approvedRegistryContract.addApprovedContract(payrollContract.address, { from: contractOwner });

        modifyTimeContracts = [executorContract, subscriptionContract, paymentRegistryContract, payrollContract];

    });

    async function newTokenSubscription(identifier) {
        return await newSubscription(
            subscriptionContract,
            tokenContract.address,
            tokenSubscriber,
            identifier,
            business,
            subscriptionInterval,
            subscriptionCost,
            subscriptionFee
        );
    };

    async function fastForwardSubscription(subscriptionHash, cycles, processLast, node) {
        return await newActiveSubscription(
            executorContract,
            subscriptionContract,
            tokenSubscriber,
            subscriptionHash,
            subscriptionInterval,
            node || serviceNode,
            cycles,
            modifyTimeContracts,
            processLast
        );
    }

    it("should be able to calculate the correct price for gas", async function() {

        let returnedPrice = await executorContract.getPricedGas(subscriptionContract.address, "", tokenContract.address);
        assert.equal(returnedPrice.toNumber(), 3 * 10 ** 17);

    });

    describe("when users create a scheduled payroll transaction", () => {

        let paymentIdentifier = Payroll.identifiers()[0];
        let activationTime = parseInt(Date.now() / 1000);
        let scheduleIdentifier;

        before(async function() {

            // Ensure time is correct
            await setTimes(modifyTimeContracts, activationTime);

            // Transfer Tokens to the business
            await tokenContract.transfer(business, subscriptionCost, { from: contractOwner });
            let approvalAmount = 1000000 * 10 ** 18;

            await tokenContract.approve(proxyContract.address, approvalAmount, { from: business });

            await nativeTokenContract.transfer(serviceNode, 1, { from: contractOwner });
            await nativeTokenContract.approve(stakeContract.address, 1, { from: serviceNode });
            await stakeContract.topUpStake(1, tokenContract.address, { from: serviceNode });

            scheduleIdentifier = await Payroll.createNewPayment(
                payrollContract,
                tokenContract,
                tokenSubscriber,
                business,
                activationTime + 10
            );

        });

        it("should not allow someone to activate before the start date", async function() {

            await assertRevert(executorContract.activateSubscription(
                payrollContract.address,
                paymentIdentifier
            ));

            let status = await payrollContract.getPaymentStatus(paymentIdentifier);
            assert.equal(status, 0);

        });

        it("should allow a service node to activate a subscription at the right time", async function() {

            await setTimes(modifyTimeContracts, activationTime + 10);

            await executorContract.activateSubscription(
                payrollContract.address,
                paymentIdentifier,
                { from: serviceNode }
            );

            let payrollInformation = await payrollContract.payments.call(paymentIdentifier);
            assert.equal(payrollInformation[2].toNumber(), activationTime + 10);

            let status = await payrollContract.getPaymentStatus(paymentIdentifier);
            assert.equal(status, 3);

            await stakeContract.withdrawStake(1, tokenContract.address, { from: serviceNode });

            // Reset balances
            let balanceTokenHolder = await tokenContract.balanceOf(tokenSubscriber);            
            await tokenContract.transfer(contractOwner, balanceTokenHolder, { from: tokenSubscriber });

        });

    });

    describe("when users activate subscriptions", () => {

        let subscriptionHash;
        let activationTime = parseInt(Date.now() / 1000);

        before(async function() {

            subscriptionHash = await newTokenSubscription("activate.new");

            // Transfer Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost, { from: contractOwner });

            // Give unlimited allowance to the transfer proxy (from subscriber)
            let approvalAmount = 1000000 * 10 ** 18;
            await tokenContract.approve(proxyContract.address, approvalAmount, { from: tokenSubscriber });

        })

        it("should not be able to subscribe to an unauthorized subscription contract", async function() {

            // @TOOD: Implementation

        });

        it("should not be able to activate a subscription without enough funds", async function() {

            // Subtract from the wallet so insufficient funds are there
            await tokenContract.transfer(contractOwner, subscriptionCost, { from: tokenSubscriber });

            // Both should fail since the users don't have enough funds
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, subscriptionHash, { from: tokenSubscriber }));

            // Top up again
            await tokenContract.transfer(tokenSubscriber, subscriptionCost, { from: contractOwner });

        });

        it("should not be able to activate if the contract is paused", async function() {

            // Setup the time we want
            await setTimes(modifyTimeContracts, activationTime);

            await executorContract.pause({ from: contractOwner });

            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, subscriptionHash, { from: tokenSubscriber }));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to activate via an authorized subscription and token contract", async function() {

            // Activate the subscription with enough funds in wrapper ether account
            await executorContract.activateSubscription(subscriptionContract.address, subscriptionHash, { from: tokenSubscriber });

            // Check if there is an element in the payment registry for the ether subscription
            let etherPaymentInfo = await paymentRegistryContract.payments.call(subscriptionHash);

            assert.equal(etherPaymentInfo[0], tokenContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), activationTime + subscriptionInterval);
            assert.equal(etherPaymentInfo[2], subscriptionCost);
            assert.equal(etherPaymentInfo[3], subscriptionFee);
            assert.equal(etherPaymentInfo[4].toNumber(), activationTime);
            assert.equal(etherPaymentInfo[5], 0);
            assert.equal(etherPaymentInfo[6], 0);

            // See if the start date has been set (subcription activated) for the ether subscription
            let etherSubscription = await subscriptionContract.subscriptions.call(subscriptionHash);
            assert.isAbove(etherSubscription[3].toNumber(), 0);

            let isActive = await subscriptionContract.getPaymentStatus(subscriptionHash);
            assert.equal(isActive, 2);

            // Check to ensure the user has a token wallet with only the service node fee remaining (since it wasn't processed)
            let userTokensBalance = await tokenContract.balanceOf(tokenSubscriber);
            assert.equal(userTokensBalance.toNumber(), 0);

            // Check to make sure the business received their funds from both parties and subscriptions
            let businessTokensBalance = await tokenContract.balanceOf(business);
            assert.equal(businessTokensBalance.toNumber(), subscriptionCost);

        });

        it("should not be able activate if it has already been activated", async function() {

            // Top up account
            await tokenContract.transfer(tokenSubscriber, subscriptionCost, { from: contractOwner });

            // These will fail since the subscriptions have already been activated
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, subscriptionHash, { from: tokenSubscriber }));

            // Reset balance to 0
            await tokenContract.transfer(contractOwner, subscriptionCost, { from: tokenSubscriber });
        });

    });

    describe("when processing a subscription", () => {

        before(async function() {

            // Set the time to now
            await setTimes(modifyTimeContracts, (Date.now() / 1000));

            // Give tokens to service node
            await nativeTokenContract.transfer(serviceNode, firstNodeStake, { from: contractOwner });
            await nativeTokenContract.approve(stakeContract.address, firstNodeStake * 100, { from: serviceNode });
            await stakeContract.topUpStake(firstNodeStake, tokenContract.address, { from: serviceNode });

            await nativeTokenContract.transfer(competingServiceNode, firstNodeStake, { from: contractOwner });
            await nativeTokenContract.approve(stakeContract.address, secondNodeStake * 100, { from: competingServiceNode });
            await stakeContract.topUpStake(secondNodeStake, tokenContract.address, { from: competingServiceNode });

        });

        it("should not be able to process before the due date", async function() {

            // Transfer two months worth of tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 2, { from: contractOwner });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newTokenSubscription("process.before_due_date");;
            let details = await fastForwardSubscription(etherSubscription, 1, false);

            // Rewind 5 seconds before it's due
            await setTimes(modifyTimeContracts, details[1] - 5);

            // Process the subscription before it's due
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, details[0], { from: serviceNode }));

            // Reset balance to 0
            await tokenContract.transfer(contractOwner, subscriptionCost, { from: tokenSubscriber });

        });

        it("should revert a subscription if the user doesn't have enough funds", async function() {

            // Transfer one months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost, { from: contractOwner });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newTokenSubscription("process.not_enough_funds");;
            await assertRevert(fastForwardSubscription(etherSubscription, 1, true));

            // let subscriptionDetails = await subscriptionContract.getPaymentStatus(etherSubscription);
            // assert.equal(subscriptionDetails, 3);

        });

        it("should not be able to process a subscription after the processing period", async function() {

            // Transfer wrapped Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 2, { from: contractOwner });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newTokenSubscription("process.after_processing");;
            let details = await fastForwardSubscription(etherSubscription, 1, false);

            // One second after processing period closes
            await setTimes(modifyTimeContracts, details[1] + subscriptionInterval / 7 + 1);

            // Process the subscription after it's maximum interval period
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, details[0], { from: serviceNode }));

            // Reset balance to 0
            await tokenContract.transfer(contractOwner, subscriptionCost, { from: tokenSubscriber });

        });

        it("should not be able to process a subscription if a service node doesn't have enough staked tokens", async function() {

            // Withdraw stake
            await stakeContract.withdrawStake(firstNodeStake, tokenContract.address, { from: serviceNode });

            // Transfer two months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 2, { from: contractOwner });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newTokenSubscription("process.not_enough_tokens");;
            await assertRevert(fastForwardSubscription(etherSubscription, 1, true));

            // Reset state
            await stakeContract.topUpStake(firstNodeStake, tokenContract.address, { from: serviceNode });
            await tokenContract.transfer(contractOwner, subscriptionCost, { from: tokenSubscriber });

        });

        it("should be able to process a subscription successfully", async function() {

            // Transfer two months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 2, { from: contractOwner });

            // Create a new subscription and fast forward one month
            let subscriptionHash = await newTokenSubscription("process.success");

            let details = await fastForwardSubscription(subscriptionHash, 1, true);

            let etherPaymentInfo = await paymentRegistryContract.payments.call(subscriptionHash);

            assert.equal(etherPaymentInfo[0], tokenContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), details[1] + subscriptionInterval);
            assert.equal(etherPaymentInfo[2], subscriptionCost);
            assert.equal(etherPaymentInfo[3], subscriptionFee);
            assert.equal(etherPaymentInfo[4], details[1]);
            assert.equal(etherPaymentInfo[5], serviceNode);
            assert.equal(etherPaymentInfo[6], 0);
            assert.equal(etherPaymentInfo[7].toNumber(), 0);

            let lastPaymentDate = await subscriptionContract.getLastSubscriptionPaymentDate(subscriptionHash);
            assert.equal(lastPaymentDate.toNumber(), details[1]);

            // Release subscription
            await executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });
        });

        it("should not be able to process someone else's subscription", async function() {

            // Transfer three months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 3, { from: contractOwner });

            // Create a new subscription and fast forward two months
            let subscriptionHash = await newTokenSubscription("process.competing_service_node");
            await fastForwardSubscription(subscriptionHash, 2, false);

            // Try processing the subscription as the competing service node
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, subscriptionHash, { from: competingServiceNode }));

            // Release subscription
            await executorContract.processSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode })
            await executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });

        });

        it("should not be able to process if the contract is paused", async function() {

            // Transfer two months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 3, { from: contractOwner });

            await executorContract.pause({ from: contractOwner });

            let subscriptionHash = await newTokenSubscription("process.free_difference.paused");
            await assertRevert(fastForwardSubscription(subscriptionHash, 2, false));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to process a subscription the next month and free the difference", async function() {

            // Create a new subscription and fast forward one month
            let subscriptionHash = await newTokenSubscription("process.free_difference");
            await fastForwardSubscription(subscriptionHash, 2, false);

            let oneMonthLaterDetails = await paymentRegistryContract.payments.call(subscriptionHash);
            let oneMonthLaterStake = await stakeContract.getAvailableStake(serviceNode, tokenContract.address);

            assert.equal(oneMonthLaterDetails[7].toNumber(), 0);
            assert.equal(oneMonthLaterStake.toNumber(), 1000);

            // Process the subscription with less tokens in the system so some should be freed up
            await executorContract.processSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });
            let twoMonthsLaterDetails = await paymentRegistryContract.payments.call(subscriptionHash);

            let twoMonthsLaterStake = await stakeContract.getAvailableStake(serviceNode, tokenContract.address);

            let requiredStake = 0;
            assert.equal(twoMonthsLaterDetails[7].toNumber(), requiredStake);
            assert.equal(twoMonthsLaterStake.toNumber(), firstNodeStake - requiredStake);

            // Release subscription
            await executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });

        });

    });

    describe("when releasing a subscription", () => {

        let subscriptionHash;
        let globalTime;

        before(async function() {

            // Transfer two months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 3, { from: contractOwner });

            // Create a new subscription and fast forward one month
            subscriptionHash = await newTokenSubscription("releasing");

            let details = await fastForwardSubscription(subscriptionHash, 1, true);
            globalTime = details[1];

        });

        it("should not be be able to release after the execution period + cancellation period (exclusive)", async function() {

            await setTimes(modifyTimeContracts, globalTime + (subscriptionInterval / 7) + 1);
            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode }));

        });

        it("should not be be able to release after the execution period + cancellation period (inclusive)", async function() {

            await setTimes(modifyTimeContracts, globalTime + (subscriptionInterval / 7));
            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode }));

        });

        it("should not be able to release an unprocessed subscription", async function() {

            await setTimes(modifyTimeContracts, globalTime + subscriptionInterval);
            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode }));

        });

        it("should not be able to release someone else's subscription", async function() {

            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: competingServiceNode }));

        });

        it("should not be able to release if the contract is paused", async function() {

            await executorContract.processSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });

            await executorContract.pause({ from: contractOwner });

            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode }));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to release after the execution period but before the cancellation period", async function() {

            await executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });

            let paymentDetails = await paymentRegistryContract.payments.call(subscriptionHash);
            assert.equal(paymentDetails[5], 0);
            assert.equal(paymentDetails[6], 0);
            assert.equal(paymentDetails[7], 0);

        });

    });

    describe("when catching a late subscription", () => {

        before(async function() {

            // Set the time to now
            await setTimes(modifyTimeContracts, (Date.now() / 1000));

        });

        it("should not be able to call if no one has processed it before", async function() {

            // Create a new subscription and fast forward two months
            let subscriptionHash = await newTokenSubscription("catch.never_processed");
            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode }));

        });

        it("should not be able to call as the original service node", async function() {

            // Transfer three months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 3, { from: contractOwner });

            // Create a new subscription and fast forward two months
            let subscriptionHash = await newTokenSubscription("catch.late.original_node");
            let details = await fastForwardSubscription(subscriptionHash, 2, false);

            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode }));

            // Withdraw the last months ether to reset state
            await executorContract.processSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });
            await executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });

        });

        it("should not be able to call before the execution period", async function() {

            // Transfer three months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 3, { from: contractOwner });

            // Create a new subscription and fast forward two months
            let subscriptionHash = await newTokenSubscription("catch.late.before_execution");
            let details = await fastForwardSubscription(subscriptionHash, 2, false);

            //await setTimes(modifyTimeContracts, globalTime - 5);
            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, subscriptionHash, { from: competingServiceNode }));

            // Withdraw the last months ether to reset state
            await executorContract.processSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });
            await executorContract.releaseSubscription(subscriptionContract.address, subscriptionHash, { from: serviceNode });

        });

        it("should be able to call if the user doesn't have enough funds in their wallet", async function() {

            // @TODO: DISABLED DUE TO AION

            /*
            // Transfer three months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 2, { from: contractOwner });

            // Create a new subscription and fast forward two months
            let subscriptionHash = await newTokenSubscription("catch.late.not_enough_funds");
            let details = await fastForwardSubscription(subscriptionHash, 2, false);

            // Catch late period is after the boundary, not before hence a second needs to be added to the current time
            await setTimes(modifyTimeContracts, details[1] + 1);
            await executorContract.catchLateSubscription(subscriptionContract.address, subscriptionHash, { from: competingServiceNode });

            // Deleted the payment registry
            let etherPaymentInfo = await paymentRegistryContract.payments.call(subscriptionHash);
            assert.equal(etherPaymentInfo[0], 0);

            // Check the subscription was cancelled
            let isSubscriptionRunning = await subscriptionContract.getPaymentStatus(subscriptionHash);
            assert.equal(isSubscriptionRunning, 3);

            // Should not be able to reactivate the subscription
            await tokenContract.transfer(tokenSubscriber, subscriptionCost, { from: contractOwner });
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, subscriptionHash));
            await tokenContract.transfer(contractOwner, subscriptionCost, { from: tokenSubscriber });
            */

        });

        it("should not be able to catch late if the user has cancelled the subscription", async function() {

            // Transfer three months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 3, { from: contractOwner });

            // Create a new subscription and fast forward one month
            let subscriptionHash = await newTokenSubscription("catch.late.cancelled");

            let details = await fastForwardSubscription(subscriptionHash, 2, false);

            await subscriptionContract.cancelPayment(subscriptionHash, { from: tokenSubscriber });

            // Should be able to catch out
            await setTimes(modifyTimeContracts, details[1] + 1);
            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, subscriptionHash, { from: competingServiceNode }));

            // // Deleted the payment registry
            // let etherPaymentInfo = await paymentRegistryContract.payments.call(subscriptionHash);
            // assert.equal(etherPaymentInfo[0], 0);

            // Withdraw the last months ether to reset state
            await tokenContract.transfer(contractOwner, subscriptionCost, { from: tokenSubscriber });

        });

        let catchLatesubscriptionHash;
        let globalTime;

        it("should not be able to catch late if the contract is paused", async function() {

            catchLatesubscriptionHash = await newTokenSubscription("catch.late.valid");

            // Transfer three months' worth of Tokens to the subscriber
            await tokenContract.transfer(tokenSubscriber, subscriptionCost * 3, { from: contractOwner });

            // Catch a late payment 10 seconds after it's due
            let details = await fastForwardSubscription(catchLatesubscriptionHash, 2, false);
            globalTime = details[1];
            await setTimes(modifyTimeContracts, globalTime + 10);

            await executorContract.pause({ from: contractOwner });

            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, catchLatesubscriptionHash, { from: competingServiceNode }));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to catch a valid late payment", async function() {

            await executorContract.catchLateSubscription(subscriptionContract.address, catchLatesubscriptionHash, { from: competingServiceNode });

            let etherPaymentInfo = await paymentRegistryContract.payments.call(catchLatesubscriptionHash);
            assert.equal(etherPaymentInfo[0], tokenContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), globalTime + subscriptionInterval);
            assert.equal(etherPaymentInfo[2], subscriptionCost);
            assert.equal(etherPaymentInfo[3], subscriptionFee);
            assert.equal(etherPaymentInfo[4], globalTime);
            assert.equal(etherPaymentInfo[5], competingServiceNode);
            assert.equal(etherPaymentInfo[6].toNumber(), 10);
            assert.equal(etherPaymentInfo[7].toNumber(), 0);

            let lastPaymentDate = await subscriptionContract.getLastSubscriptionPaymentDate(catchLatesubscriptionHash);
            assert.equal(lastPaymentDate.toNumber(), globalTime);

            await executorContract.releaseSubscription(subscriptionContract.address, catchLatesubscriptionHash, { from: competingServiceNode });

            let newStake = await stakeContract.getAvailableStake(competingServiceNode, tokenContract.address);
            assert.equal(newStake.toNumber(), 1000);

        });

    });

});