import web3 from 'web3';

import assertRevert from './helpers/assert_revert.js';
import { newPlan, newSubscription, newActiveSubscription, setTimes } from './helpers/volume_subscription.js';

// import { injectInTruffle } from './helpers/sol-trace';
// injectInTruffle(web3, artifacts);

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockExecutor = artifacts.require("./test/MockExecutor.sol");
var KyberContract = artifacts.require("./test/MockKyberNetwork.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var MockPaymentRegistryContract = artifacts.require("./test/MockPaymentRegistry.sol");

var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let kyberContract;
    let paymentRegistryContract;
    let approvedRegistryContract;

    let executorContract;
    let nativeTokenContract;
    let etherContract;
    let tokenContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let etherSubscriber = accounts[2]; // User paying $100/month subscription worth of ETH
    let tokenSubscriber = accounts[3]; // User paying $100/month subscription directly (probably in DAI)
    let serviceNode = accounts[4]; // Collector party claiming payment
    let unauthorisedAddress = accounts[5]; // Some random address
    let competingServiceNode = accounts[6]; // Another collector party claiming payment

    let subscriptionCost = 10 * 10 ** 18; // $10.00
    let subscriptionFee = 10 ** 17; // $0.10

    let exchangeRate = 2 * 10 ** 15; // 0.002 ETH/USD
    let subscriptionInterval = 30 * 24 * 60 * 60; // 30 days
    let cancellationPeriod = 6 * 60 * 60; // 6 hours

    let gini = 500;
    let divideBy = 10;

    let firstNodeStake = 1000;
    let secondNodeStake = 1000;

    let subscriptionEthCost = (subscriptionCost * exchangeRate) / (10 ** 18);
    let subscriptionEthFee = (subscriptionFee * exchangeRate) / (10 ** 18);

    let etherSubscription;
    let tokenSubscription;

    let modifyTimeContracts;

    before(async function() {

        // Initialise a mock token contract, the owner has the initial supply
        etherContract = await WrappedEther.new();
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

        console.log(`The executor contract adddress is: ${executorContract.address}`)

        // Add the executor contract as an authorised address for all the different components
        await subscriptionContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });
        await proxyContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });
        await stakeContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });
        await paymentRegistryContract.addAuthorizedAddress(executorContract.address, { from: contractOwner });

        // We need to add the wrapped ether contract and token contract to the approved list
        await approvedRegistryContract.addApprovedToken(tokenContract.address, false, { from: contractOwner });
        await approvedRegistryContract.addApprovedToken(etherContract.address, true, { from: contractOwner });

        // Make sure the relevant contracts and tokens have been authorised
        await approvedRegistryContract.addApprovedContract(subscriptionContract.address, { from: contractOwner });

        modifyTimeContracts = [executorContract, subscriptionContract, paymentRegistryContract];

    });

    async function newEtherSubscription(identifier) {
        return await newSubscription(
            subscriptionContract,
            etherContract.address,
            etherSubscriber,
            identifier,
            business,
            subscriptionInterval,
            subscriptionEthCost,
            subscriptionEthFee
        );
    };

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
            subscriptionHash,
            subscriptionInterval,
            node || serviceNode,
            cycles,
            modifyTimeContracts,
            processLast
        );
    }

    describe("when users activate subscriptions", () => {

        let etherSubscriptionHash;
        let activationTime = parseInt(Date.now() / 1000);

        before(async function() {

            etherSubscriptionHash = await newEtherSubscription("activate.new");

            // Transfer wrapped Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost });

            // Give unlimited allowance to the transfer proxy (from subscriber)
            let approvalAmount = 1000000 * 10 ** 18;
            await etherContract.approve(proxyContract.address, approvalAmount, { from: etherSubscriber });

        })

        it("should not be able to subscribe to an unauthorized subscription contract", async function() {

            // @TOOD: Implementation

        });

        it("should not be able to activate a subscription without enough funds", async function() {

            // Subtract from the wallet so insufficient funds are there
            await etherContract.withdraw(subscriptionEthCost, { from: etherSubscriber });

            // Both should fail since the users don't have enough funds
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: etherSubscriber }));

            // Top up again
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost });

        });

        it("should not be able to activate if the contract is paused", async function() {

            // Setup the time we want
            await setTimes(modifyTimeContracts, activationTime);

            await executorContract.pause({ from: contractOwner });

            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: etherSubscriber }));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to subscribe to an authorized subscription and token contract", async function() {

            // Activate the subscription with enough funds in wrapper ether account
            await executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: etherSubscriber });

            // Check if there is an element in the payment registry for the ether subscription
            let etherPaymentInfo = await paymentRegistryContract.payments.call(etherSubscriptionHash);

            assert.equal(etherPaymentInfo[0], etherContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), activationTime + subscriptionInterval);
            assert.equal(etherPaymentInfo[2], subscriptionEthCost);
            assert.equal(etherPaymentInfo[3], subscriptionEthFee);
            assert.equal(etherPaymentInfo[4].toNumber(), activationTime);
            assert.equal(etherPaymentInfo[5], 0);
            assert.equal(etherPaymentInfo[6], 0);

            // See if the start date has been set (subcription activated) for the ether subscription
            let etherSubscription = await subscriptionContract.subscriptions.call(etherSubscriptionHash);
            assert.isAbove(etherSubscription[3].toNumber(), 0);

            let isActive = await subscriptionContract.isValidSubscription(etherSubscriptionHash);
            assert.equal(isActive, true);

            // Check to ensure the user has an empty wrapped ether wallet
            let userEtherBalance = await etherContract.balanceOf(etherSubscriber);
            assert.equal(userEtherBalance.toNumber(), 0);

            // Check to make sure the business received their funds from both parties and subscriptions
            let businessEtherBalance = await etherContract.balanceOf(business);
            assert.equal(businessEtherBalance.toNumber(), subscriptionEthCost);

        });

        it("should not be able subscribe if it has already been activated", async function() {

            // Top up account
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost })

            // These will fail since the subscriptions have already been activated
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: etherSubscriber }));

            // Reset balance to 0
            await etherContract.withdraw(subscriptionEthCost, { from: etherSubscriber });
        });

    });

    describe("when processing a subscription", () => {

        before(async function() {

            // Set the time to now
            await setTimes(modifyTimeContracts, (Date.now() / 1000));

            // Give tokens to service node
            await nativeTokenContract.transfer(serviceNode, firstNodeStake, { from: contractOwner });
            await nativeTokenContract.approve(stakeContract.address, firstNodeStake * 100, { from: serviceNode });
            await stakeContract.topUpStake(firstNodeStake, etherContract.address, { from: serviceNode });

            await nativeTokenContract.transfer(competingServiceNode, firstNodeStake, { from: contractOwner });
            await nativeTokenContract.approve(stakeContract.address, secondNodeStake * 100, { from: competingServiceNode });
            await stakeContract.topUpStake(secondNodeStake, etherContract.address, { from: competingServiceNode });

        });

        it("should not be able to process before the due date", async function() {

            // Transfer wrapped Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 2 });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.before_due_date");;
            let details = await fastForwardSubscription(etherSubscription, 1, false);

            // Rewind 5 seconds before it's due
            await setTimes(modifyTimeContracts, details[1] - 5);

            // Process the subscription before it's due
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, details[0], { from: serviceNode }));

            // Reset balance to 0
            await etherContract.withdraw(subscriptionEthCost, { from: etherSubscriber });

        });

        it("should cancel a subscription if the user doesn't have enough funds", async function() {

            // Transfer one months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.not_enough_funds");;
            await fastForwardSubscription(etherSubscription, 1, true);

            let subscriptionDetails = await subscriptionContract.isValidSubscription(etherSubscription);
            assert.equal(subscriptionDetails, false);

        });

        it("should not be able to process a subscription after the processing period", async function() {

            // Transfer wrapped Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 2 });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.after_processing");;
            let details = await fastForwardSubscription(etherSubscription, 1, false);

            // One second after processing period closes
            await setTimes(modifyTimeContracts, details[1] + subscriptionInterval / 7 + 1);

            // Process the subscription after it's maximum interval period
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, details[0], { from: serviceNode }));

            // Reset balance to 0
            await etherContract.withdraw(subscriptionEthCost, { from: etherSubscriber });

        });

        it("should not be able to process a subscription if a service node doesn't have enough staked tokens", async function() {

            // Withdraw stake
            await stakeContract.withdrawStake(firstNodeStake, etherContract.address, { from: serviceNode });

            // Transfer two months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 2 });

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.not_enough_tokens");;
            await assertRevert(fastForwardSubscription(etherSubscription, 1, true));

            // Reset state
            await stakeContract.topUpStake(firstNodeStake, etherContract.address, { from: serviceNode });
            await etherContract.withdraw(subscriptionEthCost, { from: etherSubscriber });

        });

        it("should be able to process a subscription successfully", async function() {

            // Transfer two months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 2 });

            // Create a new subscription and fast forward one month
            let etherSubscriptionHash = await newEtherSubscription("process.success");

            let details = await fastForwardSubscription(etherSubscriptionHash, 1, true);
            let etherPaymentInfo = await paymentRegistryContract.payments.call(etherSubscriptionHash);

            assert.equal(etherPaymentInfo[0], etherContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), details[1] + subscriptionInterval);
            assert.equal(etherPaymentInfo[2], subscriptionEthCost);
            assert.equal(etherPaymentInfo[3], subscriptionEthFee);
            assert.equal(etherPaymentInfo[4], details[1]);
            assert.equal(etherPaymentInfo[5], serviceNode);
            assert.equal(etherPaymentInfo[6], 0);
            assert.equal(etherPaymentInfo[7].toNumber(), 0);

            let lastPaymentDate = await subscriptionContract.getLastSubscriptionPaymentDate(etherSubscriptionHash);
            assert.equal(lastPaymentDate.toNumber(), details[1]);

            // Release subscription
            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });
        });

        it("should not be able to process someone else's subscription", async function() {

            // Transfer three months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 3 });

            // Create a new subscription and fast forward two months
            let etherSubscriptionHash = await newEtherSubscription("process.competing_service_node");
            await fastForwardSubscription(etherSubscriptionHash, 2, false);

            // Try processing the subscription as the competing service node
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, etherSubscriptionHash, { from: competingServiceNode }));

            // Release subscription
            await executorContract.processSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode })
            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });

        });

        it("should not be able to process if the contract is paused", async function() {

            // Transfer two months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 3 });

            await executorContract.pause({ from: contractOwner });

            let etherSubscriptionHash = await newEtherSubscription("process.free_difference.paused");
            await assertRevert(fastForwardSubscription(etherSubscriptionHash, 2, false));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to process a subscription the next month and free the difference", async function() {

            // Create a new subscription and fast forward one month
            let etherSubscriptionHash = await newEtherSubscription("process.free_difference");
            await fastForwardSubscription(etherSubscriptionHash, 2, false);

            let oneMonthLaterDetails = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            let oneMonthLaterStake = await stakeContract.getAvailableStake(serviceNode, etherContract.address);

            assert.equal(oneMonthLaterDetails[7].toNumber(), 0);
            assert.equal(oneMonthLaterStake.toNumber(), 1000);

            // Process the subscription with less tokens in the system so some should be freed up
            await executorContract.processSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });
            let twoMonthsLaterDetails = await paymentRegistryContract.payments.call(etherSubscriptionHash);

            let twoMonthsLaterStake = await stakeContract.getAvailableStake(serviceNode, etherContract.address);

            let requiredStake = 0;
            assert.equal(twoMonthsLaterDetails[7].toNumber(), requiredStake);
            assert.equal(twoMonthsLaterStake.toNumber(), firstNodeStake - requiredStake);

            // Release subscription
            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });

        });

    });

    describe("when releasing a subscription", () => {

        let etherSubscriptionHash;
        let globalTime;

        before(async function() {

            // Transfer two months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 3 });

            // Create a new subscription and fast forward one month
            etherSubscriptionHash = await newEtherSubscription("releasing");

            let details = await fastForwardSubscription(etherSubscriptionHash, 1, true);
            globalTime = details[1];

        });

        it("should not be be able to release after the execution period + cancellation period (exclusive)", async function() {

            await setTimes(modifyTimeContracts, globalTime + (subscriptionInterval / 7) + 1);
            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode }));

        });

        it("should not be be able to release after the execution period + cancellation period (inclusive)", async function() {

            await setTimes(modifyTimeContracts, globalTime + (subscriptionInterval / 7));
            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode }));

        });

        it("should not be able to release an unprocessed subscription", async function() {

            await setTimes(modifyTimeContracts, globalTime + subscriptionInterval);
            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode }));

        });

        it("should not be able to release someone else's subscription", async function() {

            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: competingServiceNode }));

        });

        it("should not be able to release if the contract is paused", async function() {

            await executorContract.processSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });

            await executorContract.pause({ from: contractOwner });

            await assertRevert(executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode }));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to release after the execution period but before the cancellation period", async function() {

            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });

            let paymentDetails = await paymentRegistryContract.payments.call(etherSubscriptionHash);
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
            let etherSubscriptionHash = await newEtherSubscription("catch.never_processed");
            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode }));

        });

        it("should not be able to call as the original service node", async function() {

            // Transfer three months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 3 });

            // Create a new subscription and fast forward two months
            let etherSubscriptionHash = await newEtherSubscription("catch.late.original_node");
            let details = await fastForwardSubscription(etherSubscriptionHash, 2, false);

            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode }));

            // Withdraw the last months ether to reset state
            await executorContract.processSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });
            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });

        });

        it("should not be able to call before the execution period", async function() {

            // Transfer three months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 3 });

            // Create a new subscription and fast forward two months
            let etherSubscriptionHash = await newEtherSubscription("catch.late.before_execution");
            let details = await fastForwardSubscription(etherSubscriptionHash, 2, false);

            //await setTimes(modifyTimeContracts, globalTime - 5);
            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: competingServiceNode }));

            // Withdraw the last months ether to reset state
            await executorContract.processSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });
            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, { from: serviceNode });

        });

        it("should be able to call if the user doesn't have enough funds in their wallet", async function() {

            // Transfer three months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 2 });

            // Create a new subscription and fast forward two months
            let etherSubscriptionHash = await newEtherSubscription("catch.late.not_enough_funds");
            let details = await fastForwardSubscription(etherSubscriptionHash, 2, false);

            // Catch late period is after the boundary, not before hence a second needs to be added to the current time
            await setTimes(modifyTimeContracts, details[1] + 1);
            await executorContract.catchLateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: competingServiceNode });

            // Deleted the payment registry
            let etherPaymentInfo = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            assert.equal(etherPaymentInfo[0], 0);

            // Check the subscription was cancelled
            let isValidSubscription = await subscriptionContract.isValidSubscription(etherSubscriptionHash);
            assert.equal(isValidSubscription, false);

        });

        it("should able to catch late if the user has cancelled the subscription", async function() {

            // Transfer three months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 3 });

            // Create a new subscription and fast forward one month
            let etherSubscriptionHash = await newEtherSubscription("catch.late.cancelled");

            let details = await fastForwardSubscription(etherSubscriptionHash, 2, false);

            await subscriptionContract.cancelSubscription(etherSubscriptionHash, { from: etherSubscriber });

            // Should be able to catch out
            await setTimes(modifyTimeContracts, details[1] + 1);
            await executorContract.catchLateSubscription(subscriptionContract.address, etherSubscriptionHash, { from: competingServiceNode });

            // Deleted the payment registry
            let etherPaymentInfo = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            assert.equal(etherPaymentInfo[0], 0);

            // Withdraw the last months ether to reset state
            await etherContract.withdraw(subscriptionEthCost, { from: etherSubscriber });

        });

        let catchLateEtherSubscriptionHash;
        let globalTime;

        it("should not be able to catch late if the contract is paused", async function() {

            catchLateEtherSubscriptionHash = await newEtherSubscription("catch.late.valid");

            // Transfer three months' worth of Ether to the subscriber
            await etherContract.deposit({ from: etherSubscriber, value: subscriptionEthCost * 3 });

            // Catch a late payment 10 seconds after it's due
            let details = await fastForwardSubscription(catchLateEtherSubscriptionHash, 2, false);
            globalTime = details[1];
            await setTimes(modifyTimeContracts, globalTime + 10);

            await executorContract.pause({ from: contractOwner });

            await assertRevert(executorContract.catchLateSubscription(subscriptionContract.address, catchLateEtherSubscriptionHash, { from: competingServiceNode }));

            await executorContract.unpause({ from: contractOwner });

        });

        it("should be able to catch a valid late payment", async function() {

            await executorContract.catchLateSubscription(subscriptionContract.address, catchLateEtherSubscriptionHash, { from: competingServiceNode });

            let etherPaymentInfo = await paymentRegistryContract.payments.call(catchLateEtherSubscriptionHash);
            assert.equal(etherPaymentInfo[0], etherContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), globalTime + subscriptionInterval);
            assert.equal(etherPaymentInfo[2], subscriptionEthCost);
            assert.equal(etherPaymentInfo[3], subscriptionEthFee);
            assert.equal(etherPaymentInfo[4], globalTime);
            assert.equal(etherPaymentInfo[5], competingServiceNode);
            assert.equal(etherPaymentInfo[6].toNumber(), 10);
            assert.equal(etherPaymentInfo[7].toNumber(), 0);

            let lastPaymentDate = await subscriptionContract.getLastSubscriptionPaymentDate(catchLateEtherSubscriptionHash);
            assert.equal(lastPaymentDate.toNumber(), globalTime);

            await executorContract.releaseSubscription(subscriptionContract.address, catchLateEtherSubscriptionHash, { from: competingServiceNode });

            let newStake = await stakeContract.getAvailableStake(competingServiceNode, etherContract.address);
            assert.equal(newStake.toNumber(), 1000);

        });

    });

});