import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newActiveSubscription } from './helpers/volume_subscription.js';
import { injectInTruffle } from "sol-trace-set";

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

injectInTruffle(web3, artifacts);

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

  let subscriptionCost = 10*10**18; // $10.00
  let subscriptionFee = 10**17; // $0.10

  let exchangeRate = 2*10**15; // 0.002 ETH/USD
  let subscriptionInterval = 30 * 24 * 60 * 60; // 30 days
  let cancellationPeriod = 6 * 60 * 60; // 6 hours
  let multiplier = 10;
  let activationTime = parseInt(Date.now() / 1000);

  let subscriptionEthCost = (subscriptionCost * exchangeRate) / (10**18);
  let subscriptionEthFee = (subscriptionFee * exchangeRate) / (10**18);

  let etherSubscription;
  let tokenSubscription;

  before(async function() {

      // Initialise the approved registry
      approvedRegistryContract = await ApprovedRegistry.new({from: contractOwner});

      // Initialise the 8x token contract, the owner has all the initial token supply.
      nativeTokenContract = await EightExToken.new({from: contractOwner});

      // Initialise a mock token contract, the owner has the initial supply
      etherContract = await WrappedEther.new();
      tokenContract = await MockToken.new({from: contractOwner});

      // Initialise all the other contracts the executor needs in order to function
      subscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: contractOwner});
      proxyContract = await TransferProxy.new({from: contractOwner});
      stakeContract = await StakeContract.new(nativeTokenContract.address, {from: contractOwner});
      paymentRegistryContract = await MockPaymentRegistryContract.new({from: contractOwner});

      // Initialise the Kyber Network contract and give it 1000 DAI
      kyberContract = await KyberContract.new({from: contractOwner});

      tokenContract.transfer(kyberContract.address, 1000*10**18, {from: contractOwner});

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
      await approvedRegistryContract.addApprovedToken(tokenContract.address, {from: contractOwner});
      await approvedRegistryContract.addApprovedToken(etherContract.address, {from: contractOwner});

      // Now the multiplier can be set for each respective token in the system
      await approvedRegistryContract.setApprovedTokenMultiplier(tokenContract.address, multiplier, {from: contractOwner});
      await approvedRegistryContract.setApprovedTokenMultiplier(etherContract.address, multiplier, {from: contractOwner});

      // Make sure the relevant contracts and tokens have been authorised
      await approvedRegistryContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});
      await approvedRegistryContract.setApprovedContractCallCost(subscriptionContract.address, 0, 5**10*16, 10**5, 2*10**9);
  });

  async function newEtherSubscription() {
    return await newSubscription(
      subscriptionContract,
      etherContract.address,
      etherSubscriber,
      "subscrption.new.ether",
      business,
      subscriptionInterval,
      subscriptionEthCost,
      subscriptionEthFee
    );
  };

  async function newTokenSubscription() {
    return await newSubscription(
      subscriptionContract,
      tokenContract.address,
      tokenSubscriber,
      "subscription.new.plan",
      business,
      subscriptionInterval,
      subscriptionCost,
      subscriptionFee
    );
  };

  describe("when users activate subscriptions", () => {

    let etherSubscriptionHash;
    let tokenSubscriptionHash;

    before(async function() {

        etherSubscriptionHash = await newEtherSubscription();

        // Transfer wrapped Ether to the subscriber
        await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});

        // Give unlimited allowance to the transfer proxy (from subscriber)
        let approvalAmount = 1000000*10**18;
        await etherContract.approve(proxyContract.address, approvalAmount, {from: etherSubscriber});

    })

    it("should not be able to subscribe to an unauthorized subscription contract", async function() {

        let fakeSubscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: contractOwner});

        let fakePlan = await fakeSubscriptionContract.createPlan(
            business, tokenContract.address, "subscription.unauthorised.contract", "test", "", 30, 100, 10, "{}", {from: business}
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
        await executorContract.setTime(activationTime);
        await subscriptionContract.setTime(activationTime);
        await paymentRegistryContract.setTime(activationTime);

        // Activate the subscription with enough funds in wrapper ether account
        await executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber});

        // Check if there is an element in the payment registry for the ether subscription
        let etherPaymentInfo = await paymentRegistryContract.payments.call(etherSubscriptionHash);

        assert.equal(etherPaymentInfo[0], etherContract.address);
        assert.equal(etherPaymentInfo[1].toNumber(), activationTime + subscriptionInterval);
        assert.equal(etherPaymentInfo[2], subscriptionEthCost);
        assert.equal(etherPaymentInfo[3], subscriptionEthFee);
        assert.equal(etherPaymentInfo[4], 0);
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

        // Top up accounts
        await etherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});

        // These will fail since the subscriptions have already been activated
        await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, {from: etherSubscriber}));

        // Reset balance to 0
        await etherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});
    });

  });

});

