import assertRevert from './helpers/assert_revert.js';
import { newSubscription, newActiveSubscription, setTimes } from './helpers/volume_subscription.js';

// import { injectInTruffle } from './helpers/sol-trace';
// injectInTruffle(web3, artifacts);

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockExecutor = artifacts.require("./test/MockExecutor.sol");
var KyberContract = artifacts.require("./test/MockKyberNetworkInterface.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var MockPaymentRegistryContract = artifacts.require("./test/MockPaymentRegistry.sol");

var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var Requirements = artifacts.require("./Requirements.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let kyberContract;
    let paymentRegistryContract;
    let approvedRegistryContract;
    let requirementsContract;

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

    let subscriptionCost = 10*10**18; // $10.00
    let subscriptionFee = 10**17; // $0.10

    let exchangeRate = 2*10**15; // 0.002 ETH/USD
    let subscriptionInterval = 30 * 24 * 60 * 60; // 30 days
    let cancellationPeriod = 6 * 60 * 60; // 6 hours

    let gini = 500;
    let divideBy = 10;

    let firstNodeStake = 1000;
    let secondNodeStake = 1000;

    let subscriptionEthCost = (subscriptionCost * exchangeRate) / (10**18);
    let subscriptionEthFee = (subscriptionFee * exchangeRate) / (10**18);

    let etherSubscription;
    let tokenSubscription;

    let modifyTimeContracts;

    before(async function() {

        // Initialise a mock token contract, the owner has the initial supply
        etherContract = await WrappedEther.new();
        tokenContract = await MockToken.new({from: contractOwner});

        // Initialise the Kyber Network contract and give it 1000 DAI
        kyberContract = await KyberContract.new({from: contractOwner});
        await tokenContract.transfer(kyberContract.address, 1000*10**18, {from: contractOwner});

        // Initialise the approved registry
        approvedRegistryContract = await ApprovedRegistry.new(kyberContract.address, {from: contractOwner});

        // Initialise the 8x token contract, the owner has all the initial token supply.
        nativeTokenContract = await EightExToken.new({from: contractOwner});

        // Initialise all the other contracts the executor needs in order to function
        subscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        paymentRegistryContract = await MockPaymentRegistryContract.new({from: contractOwner});

        // Setup the stake contract
        stakeContract = await StakeContract.new(nativeTokenContract.address, {from: contractOwner});
        await stakeContract.setGiniCoefficient(etherContract.address, gini, {from: contractOwner});
        await stakeContract.setDivideTotalBy(etherContract.address, divideBy, {from: contractOwner});

        // Initialise the requirements contract
        requirementsContract = await Requirements.new({from: contractOwner});

        // Initialise the executor contract with all it's needed components
        executorContract = await MockExecutor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            approvedRegistryContract.address,
            requirementsContract.address,
            800,
            7,
            {from: contractOwner}
        );

        console.log(`The executor contract adddress is: ${executorContract.address}`)

        // Add the executor contract as an authorised address for all the different components
        subscriptionContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        proxyContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        stakeContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        paymentRegistryContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});

        // We need to add the wrapped ether contract and token contract to the approved list
        await approvedRegistryContract.addApprovedToken(tokenContract.address, false, {from: contractOwner});
        await approvedRegistryContract.addApprovedToken(etherContract.address, true, {from: contractOwner});

        // Make sure the relevant contracts and tokens have been authorised
        await approvedRegistryContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});
        await approvedRegistryContract.setApprovedContractCallCost(subscriptionContract.address, 0, 2**10*15, 10**5, 2*10**9);

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

    async function fastForwardSubscription(subscriptionHash, cycles, processLast) {
        return await newActiveSubscription(
            executorContract,
            subscriptionContract,
            subscriptionHash,
            subscriptionInterval,
            serviceNode,
            cycles,
            modifyTimeContracts,
            processLast
        );
    }

    describe("when users activate subscriptions", () => {

        let etherSubscriptionHash;
        let tokenSubscriptionHash;

        before(async function() {

            etherSubscriptionHash = await newEtherSubscription("activate.new");

            // Transfer wrapped Ether to the subscriber
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});

            // Give unlimited allowance to the transfer proxy (from subscriber)
            let approvalAmount = 1000000*10**18;
            await etherContract.approve(proxyContract.address, approvalAmount, {from: etherSubscriber});

        })

        it("should not be able to subscribe to an unauthorized subscription contract", async function() {

            let fakeSubscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: contractOwner});

            let fakePlan = await fakeSubscriptionContract.createPlan(
                business, tokenContract.address, "subscription.unauthorised.contract", 30, 100, 10, "{}", {from: business}
            );

            let fakePlanHash = fakePlan.logs[0].args.identifier;

            await assertRevert(executorContract.activateSubscription(fakeSubscriptionContract.address, fakePlanHash, {from: etherSubscriber}));

        });

        it("should not be able to activate a subscription without enough funds", async function() {

            // Subtract from the wallet so insufficient funds are there
            await etherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});

            // Both should fail since the users don't have enough funds
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber}));

            // Top up again
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});

        });

        it("should be able to subscribe to an authorized subscription and token contract", async function() {

            // Setup the time we want
            let activationTime = parseInt(Date.now() / 1000);
            await setTimes(modifyTimeContracts, activationTime);

            // Activate the subscription with enough funds in wrapper ether account
            await executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber});

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
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost})

            // These will fail since the subscriptions have already been activated
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber}));

            // Reset balance to 0
            await etherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});
        });

    });

    describe("when processing a subscription", () => {

        before(async function() {

            // Set the time to now
            await setTimes(modifyTimeContracts, (Date.now()/1000));

            // Give tokens to service node
            await nativeTokenContract.transfer(serviceNode, firstNodeStake, {from: contractOwner});
            await nativeTokenContract.approve(stakeContract.address, firstNodeStake * 100, {from: serviceNode});
            await stakeContract.topUpStake(firstNodeStake, etherContract.address, {from: serviceNode});

            await nativeTokenContract.transfer(competingServiceNode, firstNodeStake, {from: contractOwner});
            await nativeTokenContract.approve(stakeContract.address, secondNodeStake * 100, {from: competingServiceNode});
            await stakeContract.topUpStake(secondNodeStake, etherContract.address, {from: competingServiceNode});

        });

        it("should not be able to process before the due date", async function() {

            // Transfer wrapped Ether to the subscriber
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost * 2});

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.before_due_date");;
            let details = await fastForwardSubscription(etherSubscription, 1, false);

            // Rewind 5 seconds before it's due
            await setTimes(modifyTimeContracts, details[1] - 5);

            // Process the subscription before it's due
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, details[0], {from: serviceNode}));

            // Reset balance to 0
            await etherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});

        });

        it("should cancel a subscription if the user doesn't have enough funds", async function() {

            // Transfer one months' worth of Ether to the subscriber
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.not_enough_funds");;
            await fastForwardSubscription(etherSubscription, 1, true);

            let subscriptionDetails = await subscriptionContract.isValidSubscription(etherSubscription);
            assert.equal(subscriptionDetails, false);

        });

        it("should not be able to process a subscription after the processing period", async function() {

            // Transfer wrapped Ether to the subscriber
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost * 2});

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.after_processing");;
            let details = await fastForwardSubscription(etherSubscription, 1, false);

            // One second after processing period closes
            await setTimes(modifyTimeContracts, details[1] + subscriptionInterval/7 + 1);

            // Process the subscription after it's maximum interval period
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, details[0], {from: serviceNode}));

            // Reset balance to 0
            await etherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});

        });

        it("should not be able to process a subscription if a service node doesn't have enough staked tokens", async function() {

            // Withdraw stake
            await stakeContract.withdrawStake(firstNodeStake, etherContract.address, {from: serviceNode});

            // Transfer two months' worth of Ether to the subscriber
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost * 2});

            // Create a new subscription and fast forward one month
            let etherSubscription = await newEtherSubscription("process.not_enough_tokens");;
            await assertRevert(fastForwardSubscription(etherSubscription, 1, true));

            // Reset state
            await stakeContract.topUpStake(firstNodeStake, etherContract.address, {from: serviceNode});
            await etherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});

        });

        it("should be able to process a subscription successfully", async function() {

            // Transfer two months' worth of Ether to the subscriber
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost * 2});

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
            assert.equal(etherPaymentInfo[7].toNumber(), ((firstNodeStake + secondNodeStake) / divideBy) * 0.8);

            // Release subscription
            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode});
        });

        it("should not be able to process someone else's subscription", async function() {

            // Transfer three months' worth of Ether to the subscriber
            await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost * 3});

            // Create a new subscription and fast forward two months
            let etherSubscriptionHash = await newEtherSubscription("process.competing_service_node");
            await fastForwardSubscription(etherSubscriptionHash, 2, false);

            // Try processing the subscription as the competing service node
            await assertRevert(executorContract.processSubscription(subscriptionContract.address, etherSubscriptionHash, {from: competingServiceNode}));

            // Release subscription
            await executorContract.releaseSubscription(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode});

        });

        it("should be able to process a subscription the next month and free the difference", async function() {

            // @TODO: Implementation

        });

    });

    /*

    describe("when releasing a subscription", () => {

        it("should not be able to release someone else's subscription", async function() {

            // @TODO: Implementation

        });

        it("should not be able to release an unprocessed subscription", async function() {

            // @TODO: Implementation

        });

        it("should not be be able to release after the execution period + cancellation period (exclusive)", async function() {

            // @TODO: Implementation

        });

        it("should not be be able to release after the execution period + cancellation period (inclusive)", async function() {

            // @TODO: Implementation

        });

        it("should be able to rellease after the execution period but before the cancellation period", async function() {

            // @TODO: Implementation

        });

    });

    describe("when catching a late subscription", () => {

        it("should not be able to call as the original service node", async function() {

            // @TODO: Implementation

        });

        it("should not be able to call before the execution period", async function() {

            // @TODO: Implementation

        });

        it("should not be able to call if the user doesn't have enough funds in their wallet", async function() {

            // @TODO: Implementation

        });

        it("should be able to catch a valid late payment", async function() {

            // @TODO: Implementation

        });

    });

    describe("when cancelling a subscription", () => {

        it("should not be able to call if the user has enough funds", async function() {

            // @TODO: Implementation

        });

        it("should not be able to call before the due date", async function() {

            // @TODO: Implementation

        });

        it("should not be able to call as another user", async function() {

            // @TODO: Implementation

        });

        it("should be able to cancel if the user doesn't have enough funds", async function() {

            // @TODO: Implementation

        });

    });

    */

});

