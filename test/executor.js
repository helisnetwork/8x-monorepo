import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockExecutor = artifacts.require("./test/MockExecutor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var MockPaymentRegistryContract = artifacts.require("./test/MockPaymentRegistry.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var KyberContract = artifacts.require("./test/MockKyberNetworkInterface.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let paymentRegistryContract;
    let kyberContract;
    let approvedRegistryContract;

    let executorContract;
    let nativeTokenContract;
    let wrappedEtherContract;
    let transactingCurrencyContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let etherSubscriber = accounts[2]; // User paying $100/month subscription worth of ETH
    let tokenSubscriber = accounts[3]; // User paying $100/month subscription directly (probably in DAI)
    let serviceNode = accounts[4]; // Collector party claiming payment
    let unauthorisedAddress = accounts[5]; // Some random address
    let competingServiceNode = accounts[6]; // Another collector party claiming payment

    let planIdentifier;

    let ethPlanHash;
    let etherSubscriptionHash;
    let tokenPlanHash;
    let tokenSubscriptionHash;

    let subscriptionCost = 10*10**18; // $10.00
    let exchangeRate = 2*10**15; // 0.002 ETH/USD
    let subscriptionEthCost = (subscriptionCost * exchangeRate) / (10**18);

    let subscriptionFee = 10**17; // $0.10
    let subscriptionEthFee = (subscriptionFee * exchangeRate) / (10**18);

    let subscriptionInterval = 30 * 24 * 60 * 60; // 30 days
    let cancellationPeriod = 6 * 60 * 60; // 6 hours
    let multiplier = 10;

    let activationTime = parseInt(Date.now() / 1000);
    let oneMonthLater = parseInt(activationTime + subscriptionInterval);
    let twoMonthsLater = oneMonthLater + subscriptionInterval;
    let threeMonthsLater = twoMonthsLater + subscriptionInterval;

    let tokenStake = (subscriptionCost * multiplier);
    let ethStake = (subscriptionEthCost * multiplier);
    let totalStake = tokenStake + ethStake;

    before(async function() {

        // Initialise the approved registry
        approvedRegistryContract = await ApprovedRegistry.new({from: contractOwner});

        // Initialise the 8x token contract, the owner has all the initial token supply.
        nativeTokenContract = await EightExToken.new({from: contractOwner});

        // Initialise a mock token contract, the owner has the initial supply
        wrappedEtherContract = await WrappedEther.new();
        transactingCurrencyContract = await MockToken.new({from: contractOwner});

        // Initialise all the other contracts the executor needs in order to function
        subscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        stakeContract = await StakeContract.new(nativeTokenContract.address, {from: contractOwner});
        paymentRegistryContract = await MockPaymentRegistryContract.new({from: contractOwner});

        // Initialise the Kyber Network contract and give it 1000 DAI
        kyberContract = await KyberContract.new({from: contractOwner});

        transactingCurrencyContract.transfer(kyberContract.address, 1000*10**18, {from: contractOwner});

        // Initialise the executor contract with all it's needed components
        executorContract = await MockExecutor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            kyberContract.address,
            approvedRegistryContract.address,
            {from: contractOwner}
        );

        // Add the executor contract as an authorised address for all the different components
        subscriptionContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        proxyContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        stakeContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        paymentRegistryContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});

        // We need to add the wrapped ether contract and token contract to the approved list
        await approvedRegistryContract.addApprovedToken(transactingCurrencyContract.address, {from: contractOwner});
        await approvedRegistryContract.addApprovedToken(wrappedEtherContract.address, {from: contractOwner});

        // Now the multiplier can be set for each respective token in the system
        await approvedRegistryContract.setApprovedTokenMultiplier(transactingCurrencyContract.address, multiplier, {from: contractOwner});
        await approvedRegistryContract.setApprovedTokenMultiplier(wrappedEtherContract.address, multiplier, {from: contractOwner});

        // Make sure the relevant contracts and tokens have been authorised
        await approvedRegistryContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});
        await approvedRegistryContract.setApprovedContractCallCost(subscriptionContract.address, 0, 5**10*16, 10**5, 2*10**9);

        // Create a new subscription plan
        let newTokenPlan = await subscriptionContract.createPlan(
            business, transactingCurrencyContract.address, "subscription.new.token", "test", "", subscriptionInterval, subscriptionCost, subscriptionFee, "{}", {from: business}
        );

        // The hash that we can use to identify the plan
        tokenPlanHash = newTokenPlan.logs[0].args.identifier;

        // Create a new subscription plan
        let newEthPlan = await subscriptionContract.createPlan(
            business, wrappedEtherContract.address, "subscription.new.ether", "test", "", subscriptionInterval, subscriptionEthCost, subscriptionEthFee, "{}", {from: business}
        );

        // The hash that we can use to identify the plan
        ethPlanHash = newEthPlan.logs[0].args.identifier;

        // Create a new subscription (from a subscriber)
        let newEtherSubscription = await subscriptionContract.createSubscription(
            ethPlanHash, "{}", {from: etherSubscriber}
        );

        let newTokenSubscription = await subscriptionContract.createSubscription(
            tokenPlanHash, "{}", {from: tokenSubscriber}
        );

        // The hash we can use to identify the subscription
        etherSubscriptionHash = newEtherSubscription.logs[0].args.identifier;
        tokenSubscriptionHash = newTokenSubscription.logs[0].args.identifier;

    });

    describe("when users activate subscriptions", () => {

        before(async function() {

            // Transfer wrapped Ether to the subscriber
            await wrappedEtherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost, {from: contractOwner});

            // Give unlimited allowance to the transfer proxy (from subscriber)
            let approvalAmount = 1000000*10**18;
            await wrappedEtherContract.approve(proxyContract.address, approvalAmount, {from: etherSubscriber});
            await transactingCurrencyContract.approve(proxyContract.address, approvalAmount, {from: tokenSubscriber});

        })

        it("should not be able to subscribe to an unauthorized subscription contract", async function() {

            let fakeSubscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: contractOwner});

            let fakePlan = await fakeSubscriptionContract.createPlan(
                business, transactingCurrencyContract.address, "subscription.unauthorised.contract", "test", "", 30, 100, 10, "{}", {from: business}
            );

            let fakePlanHash = fakePlan.logs[0].args.identifier;

            await assertRevert(executorContract.activateSubscription(fakeSubscriptionContract.address, fakePlanHash, {from: etherSubscriber}));
            await assertRevert(executorContract.activateSubscription(fakeSubscriptionContract.address, fakePlanHash, {from: tokenSubscriber}));

        });

        it("should not be able to activate a subscription without enough funds", async function() {

            let difference = 10**15;

            // Subtract from the wallet so insufficient funds are there
            await wrappedEtherContract.withdraw(difference, {from: etherSubscriber});
            await transactingCurrencyContract.transfer(contractOwner, difference, {from: tokenSubscriber});

            // Both should fail since the users don't have enough funds
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber}));
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, tokenSubscriptionHash, {from: tokenSubscriber}));

            // Top up again
            await wrappedEtherContract.deposit({from: etherSubscriber, value: difference});
            await transactingCurrencyContract.transfer(tokenSubscriber, difference, {from: contractOwner});

        });

        it("should be able to subscribe to an authorized subscription and token contract", async function() {

            // Setup the time we want
            await executorContract.setTime(activationTime);
            await subscriptionContract.setTime(activationTime);
            await paymentRegistryContract.setTime(activationTime);

            // Activate the subscription with enough funds in wrapper ether account
            await executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber});

            // Activate the subscription with enough funds in the transacting token contract
            await executorContract.activateSubscription(subscriptionContract.address, tokenSubscriptionHash, {from: tokenSubscriber});

            // Check if there is an element in the payment registry for the ether subscription
            let etherPaymentInfo = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            assert.equal(etherPaymentInfo[0], wrappedEtherContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), oneMonthLater);
            assert.equal(etherPaymentInfo[2], subscriptionEthCost);
            assert.equal(etherPaymentInfo[3], subscriptionEthFee);
            assert.equal(etherPaymentInfo[4], 0);
            assert.equal(etherPaymentInfo[5], 0);
            assert.equal(etherPaymentInfo[6], 0);

            // Check if there is an element in the subscription registry for the token subscription
            let tokenPaymentInfo = await paymentRegistryContract.payments.call(tokenSubscriptionHash);
            assert.equal(tokenPaymentInfo[0], transactingCurrencyContract.address);
            assert.equal(tokenPaymentInfo[1].toNumber(), oneMonthLater);
            assert.equal(tokenPaymentInfo[2], subscriptionCost);
            assert.equal(tokenPaymentInfo[3], subscriptionFee);
            assert.equal(tokenPaymentInfo[4], 0);
            assert.equal(tokenPaymentInfo[5], 0);
            assert.equal(etherPaymentInfo[6], 0);

            // See if the start date has been set (subcription activated) for the ether subscription
            let etherSubscription = await subscriptionContract.subscriptions.call(etherSubscriptionHash);
            assert.isAbove(etherSubscription[3].toNumber(), 0);

            // See if the start date has been set (subcription activated) for the token subscription
            let tokenSubscription = await subscriptionContract.subscriptions.call(tokenSubscriptionHash);
            assert.isAbove(tokenSubscription[3].toNumber(), 0);

            // Check to ensure the user has an empty wrapped ether wallet
            let userEtherBalance = await wrappedEtherContract.balanceOf(etherSubscriber);
            assert.equal(userEtherBalance.toNumber(), 0);

            // Check to ensure the user has an empty token wallet
            let userTokenBalance = await transactingCurrencyContract.balanceOf(tokenSubscriber);
            assert.equal(userTokenBalance.toNumber(), 0);

            // Check to make sure the business received their funds from both parties
            let businessTokenBalance = await transactingCurrencyContract.balanceOf(business);
            assert.equal(businessTokenBalance.toNumber(), subscriptionCost);

            let etherTokenBalance = await wrappedEtherContract.balanceOf(business);
            assert.equal(etherTokenBalance.toNumber(), subscriptionEthCost);

        });

        it("should not be able subscribe if it has already been activated", async function() {

            // Top up accounts
            await wrappedEtherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost, {from: contractOwner});

            let result = await subscriptionContract.isValidSubscription(etherSubscriptionHash);
            let result2 = await subscriptionContract.isValidSubscription(tokenSubscriptionHash);

            // These will fail since the subscriptions have already been activated
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber}));
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, tokenSubscriptionHash, {from: tokenSubscriber}));

            // Reset balance to 0
            await wrappedEtherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});
            await transactingCurrencyContract.transfer(contractOwner, subscriptionCost, {from: tokenSubscriber});
        });

    });

    describe("when service nodes process subscriptions", () => {

        let difference = 1000;

        before(async function() {

            // Set the time forward by one month
            await executorContract.setTime(oneMonthLater);
            await subscriptionContract.setTime(oneMonthLater)
            await paymentRegistryContract.setTime(oneMonthLater);

            // Transfer tokens for the actual payment
            await wrappedEtherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost, {from: contractOwner});

            // Give tokens to service node
            await nativeTokenContract.transfer(serviceNode, totalStake, {from: contractOwner});

        });

        it("should not be able to process an inactive subscription", async function() {

            // This will have a different hash since the timestamp is different
            let inactiveEtherSubscription = await subscriptionContract.createSubscription(
                ethPlanHash, "{}", {from: etherSubscriber}
            );

            let inactiveTokenSubscription = await subscriptionContract.createSubscription(
                tokenPlanHash, "{}", {from: tokenSubscriber}
            );

            // The hash we can use to identify the subscription
            let inactiveEtherSubscriptionHash = inactiveEtherSubscription.logs[0].args.identifier;
            let inactiveTokenSubscriptionHash = inactiveTokenSubscription.logs[0].args.identifier;

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, inactiveEtherSubscriptionHash, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, inactiveTokenSubscriptionHash, {from: serviceNode}));

        });

        it("should not be able to process a subscription before the due date", async function() {

            // Set the time right before the due date
            await executorContract.turnBackTime(5);
            await subscriptionContract.turnBackTime(5);
            await paymentRegistryContract.turnBackTime(5);

            // Collect the payments but we know they'll fail since it's before the due date
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, {from: serviceNode}));

            await executorContract.turnBackTime(-5);
            await subscriptionContract.turnBackTime(-5);
            await paymentRegistryContract.turnBackTime(-5);

        });

        it("should not be able to process a subscription if the service node does not have any staked tokens", async function() {

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, {from: serviceNode}));

        });

        it("should not be able to process a subscription if the service node does not have enough staked tokens", async function() {

            // Top up your stake by 1000
            await nativeTokenContract.approve(stakeContract.address, difference * 2, {from: serviceNode});
            await stakeContract.topUpStake(difference, wrappedEtherContract.address, {from: serviceNode});
            await stakeContract.topUpStake(difference, transactingCurrencyContract.address, {from: serviceNode});

            // Check the balance to ensure it topped up the correct amount
            let ethBalance = await stakeContract.getAvailableStake(serviceNode, wrappedEtherContract.address);
            let tokenBalance = await stakeContract.getAvailableStake(serviceNode, transactingCurrencyContract.address);
            assert.equal(ethBalance.toNumber(), difference);
            assert.equal(tokenBalance.toNumber(), difference);

            // Should fail when collecting payment since there aren't enough tokens staked
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, {from: serviceNode}));

            // Withdraw tokens
            await stakeContract.withdrawStake(difference, wrappedEtherContract.address, {from: serviceNode});
            await stakeContract.withdrawStake(difference, transactingCurrencyContract.address, {from: serviceNode});

            let postEthBalance = await stakeContract.getAvailableStake(serviceNode, wrappedEtherContract.address);
            let postTokenBalance = await stakeContract.getAvailableStake(serviceNode, transactingCurrencyContract.address);
            assert.equal(postEthBalance, 0);
            assert.equal(postTokenBalance, 0);

        });

        it("should be able to process a valid subscription", async function() {

            // Check to ensure the user has enough funds
            let preUserEthBalance = await wrappedEtherContract.balanceOf(etherSubscriber);
            let preUserTokenBalance = await transactingCurrencyContract.balanceOf(tokenSubscriber);
            let preBusinessEthBalance = await wrappedEtherContract.balanceOf(business);
            let preBusinessTokenBalance = await transactingCurrencyContract.balanceOf(business);

            await nativeTokenContract.approve(stakeContract.address, totalStake, {from: serviceNode});

            assert.equal(preUserTokenBalance.toNumber(), subscriptionCost);
            assert.equal(preUserEthBalance.toNumber(), subscriptionEthCost);

            // Top up stake by difference
            let getApproval = await nativeTokenContract.allowance(serviceNode, stakeContract.address);
            let numberOfTokens = await nativeTokenContract.balanceOf(serviceNode);

            await stakeContract.topUpStake(ethStake, wrappedEtherContract.address, {from: serviceNode});
            await stakeContract.topUpStake(tokenStake, transactingCurrencyContract.address, {from: serviceNode});

            // Check the balance to ensure it topped up the correct amount
            let ethBalance = await stakeContract.getAvailableStake(serviceNode, wrappedEtherContract.address);
            let tokenBalance = await stakeContract.getAvailableStake(serviceNode, transactingCurrencyContract.address);
            assert.equal(ethBalance.toNumber(), ethStake);
            assert.equal(tokenBalance.toNumber(), tokenStake);

            let transferProxyEthAllowance = await wrappedEtherContract.allowance(etherSubscriber, proxyContract.address);
            let transferProxyTokenAllowance = await transactingCurrencyContract.allowance(tokenSubscriber, proxyContract.address);


            // Should be able to process now that the service node has enough staked tokens
            await executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode});
            await executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, {from: serviceNode});

            // Check if the service node got their reward and tokens locked up
            let postServiceNodeEthBalance = await stakeContract.getAvailableStake(serviceNode, wrappedEtherContract.address);
            let postServiceNodeTokenBalance = await stakeContract.getAvailableStake(serviceNode, transactingCurrencyContract.address);
            assert.equal(postServiceNodeEthBalance, 0);
            assert.equal(postServiceNodeTokenBalance, 0);

            // Check if the balance of the user was subtracted
            let postEtherUserBalance = await wrappedEtherContract.balanceOf(etherSubscriber);
            let postTokenUserBalance = await transactingCurrencyContract.balanceOf(tokenSubscriber);
            assert.equal(postEtherUserBalance.toNumber(), 0);
            assert.equal(postTokenUserBalance.toNumber(), 0);

            // Check if the businesses' account was credited
            let postBusinessTokenBalance = await transactingCurrencyContract.balanceOf(business);
            assert.equal(postBusinessTokenBalance.toNumber() - preBusinessTokenBalance, (subscriptionCost - subscriptionFee));

            let postBusinessEthBalance = await wrappedEtherContract.balanceOf(business);
            assert.equal(postBusinessEthBalance.toNumber() - preBusinessEthBalance, (subscriptionEthCost - subscriptionEthFee));

        });

        it("should not be able to process a subscription once it has already been processed", async function() {

            // Transfer some tokens to a competing service node
            await nativeTokenContract.transfer(competingServiceNode, totalStake, {from: contractOwner});

            // Approve the stake contract to take 8x tokens from you
            await nativeTokenContract.approve(stakeContract.address, totalStake, {from: competingServiceNode});

            // Top up your stake in the stake contract
            await stakeContract.topUpStake(ethStake, wrappedEtherContract.address, {from: competingServiceNode});
            await stakeContract.topUpStake(tokenStake, transactingCurrencyContract.address, {from: competingServiceNode});

            // Check the balance to ensure it topped up the correct amount
            let ethBalance = await stakeContract.getAvailableStake(competingServiceNode, wrappedEtherContract.address);
            let tokenBalance = await stakeContract.getAvailableStake(competingServiceNode, transactingCurrencyContract.address);

            assert.equal(ethBalance.toNumber(), ethStake);
            assert.equal(tokenBalance.toNumber(), tokenStake);

            // Should fail when collecting payment since it has already been claimed/processed
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, {from: competingServiceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, {from: competingServiceNode}));

        });

        it("should reduce the number of locked up tokens if the multiplier is lowered at the time of claiming next time", async function() {

            // @TODO: Implementation

            // Set the time forward by another month
            await executorContract.setTime(twoMonthsLater);
            await subscriptionContract.setTime(twoMonthsLater)
            await paymentRegistryContract.setTime(twoMonthsLater);

            // Top up accounts again
            await wrappedEtherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost, {from: contractOwner});

            // Check to ensure all the tokens are locked up
            let ethBalance = await stakeContract.getAvailableStake(serviceNode, wrappedEtherContract.address);
            let tokenBalance = await stakeContract.getAvailableStake(serviceNode, transactingCurrencyContract.address);

            assert.equal(ethBalance.toNumber(), 0);
            assert.equal(tokenBalance.toNumber(), 0);

            // Reduce the multiplier
            await approvedRegistryContract.setApprovedTokenMultiplier(transactingCurrencyContract.address, multiplier/2, {from: contractOwner});
            await approvedRegistryContract.setApprovedTokenMultiplier(wrappedEtherContract.address, multiplier/2, {from: contractOwner});

            // Should be able to process the subscription but will unstake token
            await executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode});
            await executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, {from: serviceNode});

            // Check the balance to ensure it reduced the right amount
            let postEthBalance = await stakeContract.getAvailableStake(serviceNode, wrappedEtherContract.address);
            let postTokenBalance = await stakeContract.getAvailableStake(serviceNode, transactingCurrencyContract.address);
            assert.equal(postEthBalance.toNumber(), ethStake/2);
            assert.equal(postTokenBalance.toNumber(), tokenStake/2);

            // Check the payments registry has been updated
            let etherPaymentInformation = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            assert.equal(etherPaymentInformation[7].toNumber(), multiplier/2);

            let tokenPaymentInformation = await paymentRegistryContract.payments.call(tokenSubscriptionHash);
            assert.equal(tokenPaymentInformation[7].toNumber(), multiplier/2);

        });

    });

    describe("when service nodes cancel a subscription", () => {

        it("should not be to set the cancellation period as an unauthorised period", async function() {

            await assertRevert(executorContract.setCancellationPeriod(cancellationPeriod, {from: unauthorisedAddress}));

        });

        it("should be able to set the cancellation period as an authorised address", async function() {

            await executorContract.setCancellationPeriod(cancellationPeriod, {from: contractOwner});

            let period = await executorContract.cancellationPeriod.call();
            assert.equal(period.toNumber(), cancellationPeriod);

        });

        it("should not be able to if the due date has already passed cancellation period", async function() {

            // Set the time to right at the boundary of the cancellation period
            await executorContract.turnBackTime(-cancellationPeriod);
            await subscriptionContract.turnBackTime(-cancellationPeriod);
            await paymentRegistryContract.turnBackTime(-cancellationPeriod);

            await assertRevert(executorContract.releasePayment(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode}));

        });

        it("should not be able to as the wrong service node", async function() {


            // Set the time to one hour before the cancellation period
            await executorContract.turnBackTime(60 * 60);
            await subscriptionContract.turnBackTime(60 * 60);
            await paymentRegistryContract.turnBackTime(60 * 60);

            await assertRevert(executorContract.releasePayment(subscriptionContract.address, etherSubscriptionHash, {from: competingServiceNode}));

        })

        it("should be able to if it has not passed the cancellation period", async function() {

            await executorContract.releasePayment(subscriptionContract.address, etherSubscriptionHash, {from: serviceNode});

            // Check the payments registry has been updated
            let etherPaymentInformation = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            assert.equal(etherPaymentInformation[0], wrappedEtherContract.address);
            assert.equal(etherPaymentInformation[1].toNumber(), threeMonthsLater);
            assert.equal(etherPaymentInformation[2].toNumber(), subscriptionEthCost);
            assert.equal(etherPaymentInformation[3].toNumber(), subscriptionEthFee);
            assert.equal(etherPaymentInformation[4].toNumber(), twoMonthsLater);
            assert.equal(etherPaymentInformation[5], 0); // No claimant
            assert.equal(etherPaymentInformation[6], 0); // No execution time
            assert.equal(etherPaymentInformation[7].toNumber(), 0); // Reset the multiplier

        });

    });

    describe("when a service node doesn't process a subscription", () => {

        let claimDelay = 60;

        it("should not be able to slash before the due date and execution period", async function() {

            await executorContract.setTime(threeMonthsLater);
            await subscriptionContract.setTime(threeMonthsLater);
            await paymentRegistryContract.setTime(threeMonthsLater);

            await assertRevert(executorContract.catchLatePayment(subscriptionContract.address, tokenSubscriptionHash, {from: competingServiceNode}));

        });

        it("should not be able to slash as the original claimant", async function() {

            await executorContract.turnBackTime(-claimDelay);
            await subscriptionContract.turnBackTime(-claimDelay);
            await paymentRegistryContract.turnBackTime(-claimDelay);

            await assertRevert(executorContract.catchLatePayment(subscriptionContract.address, tokenSubscriptionHash, {from: serviceNode}));

        });

        it("should be able to slash after the due date and execution period", async function() {

            // Top up some coin
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost, {from: contractOwner});

            // Get the stake balance of the original service node
            let originalServiceNodePreTokenBalance = await stakeContract.getTotalStake(serviceNode, transactingCurrencyContract.address)
            assert.equal(originalServiceNodePreTokenBalance.toNumber(), tokenStake);

            // Get the stake balance of the competing service node
            let competingServiceNodePreTokenBalance = await stakeContract.getTotalStake(competingServiceNode, transactingCurrencyContract.address)
            assert.equal(competingServiceNodePreTokenBalance.toNumber(), tokenStake);

            await executorContract.catchLatePayment(subscriptionContract.address, tokenSubscriptionHash, {from: competingServiceNode});

            // Get the stake balance of the original service node afterwards
            let originalServiceNodePostTokenBalance = await stakeContract.getTotalStake(serviceNode, transactingCurrencyContract.address)
            assert.equal(originalServiceNodePostTokenBalance.toNumber(), tokenStake/2);

            // Get the stake balance of the competing service node afterwards
            let competingServiceNodePostTokenBalance = await stakeContract.getTotalStake(competingServiceNode, transactingCurrencyContract.address)
            assert.equal(competingServiceNodePostTokenBalance.toNumber(), tokenStake * 1.5);

            // Check the payments registry has been updated
            let tokenPaymentInformation = await paymentRegistryContract.payments.call(tokenSubscriptionHash);
            assert.equal(tokenPaymentInformation[0], transactingCurrencyContract.address);
            assert.equal(tokenPaymentInformation[1].toNumber(), threeMonthsLater + subscriptionInterval);
            assert.equal(tokenPaymentInformation[2].toNumber(), subscriptionCost);
            assert.equal(tokenPaymentInformation[3].toNumber(), subscriptionFee);
            assert.equal(tokenPaymentInformation[4].toNumber(), threeMonthsLater + claimDelay);
            assert.equal(tokenPaymentInformation[5], competingServiceNode);
            assert.equal(tokenPaymentInformation[6], claimDelay); // We claimed it 60 seconds after it was due
            assert.equal(tokenPaymentInformation[7].toNumber(), multiplier/2);

        });

    });

});