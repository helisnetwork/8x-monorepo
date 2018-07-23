import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var Executor = artifacts.require("./test/MockExecutor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var PaymentRegistryContract = artifacts.require("./test/PaymentRegistry.sol");
var MockToken = artifacts.require("./test/MockToken.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let paymentRegistryContract;

    let executorContract;
    let nativeTokenContract;
    let mockTokenContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let subscriber = accounts[2]; // User paying $100/month subscription
    let serviceNode = accounts[3]; // Collector party claiming payment
    let unauthorisedAddress = accounts[4]; // Some random address
    let competingServiceNode = accounts[5]; // Another collector party claiming payment

    let planIdentifier;

    let planHash;
    let subscriptionHash;

    let subscriptionCost = 10*10**18; // $10.00
    let subscriptionFee = 10**17; // $0.10
    let subscriptionInterval = 30 * 24 * 60 * 60;

    before(async function() {

        // Initialise the 8x token contract, the owner has all the initial token supply.
        nativeTokenContract = await EightExToken.new({from: contractOwner});

        // Initialise a mock token contract, the owner has the initial supply
        mockTokenContract = await MockToken.new({from: contractOwner});

        // Initialise all the other contracts the executor needs in order to function
        subscriptionContract = await MockVolumeSubscription.new({from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        stakeContract = await StakeContract.new(nativeTokenContract.address, {from: contractOwner});
        paymentRegistryContract = await PaymentRegistryContract.new({from: contractOwner});

        // Initialise the executor contract with all it's needed components
        executorContract = await Executor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            {from: contractOwner}
        );

        // Add the executor contract as an authorised address for all the different components
        subscriptionContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        proxyContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        stakeContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        paymentRegistryContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});

        // Create a new subscription plan
        let newPlan = await subscriptionContract.createPlan(
            business, mockTokenContract.address, "subscription.new", "test", "", subscriptionInterval, subscriptionCost, subscriptionFee, "{}", {from: business}
        );

        // The hash that we can use to identify the plan
        planHash = newPlan.logs[0].args.identifier;

        // Create a new subscription (from a subscriber)
        let newSubscription = await subscriptionContract.createSubscription(
            planHash, "{}", {from: subscriber}
        );

        // The hash we can use to identify the subscription
        subscriptionHash = newSubscription.logs[0].args.identifier;

    });

    describe("basic tests", () => {

        it("should throw if someone other than the owner tries to set the multiplier", async function() {

            await assertRevert(executorContract.updateMultiplier(10, {from: unauthorisedAddress}));

        });

        it("should be able to set the multiplier as the owner", async function() {

            await executorContract.updateMultiplier(10, {from: contractOwner});

            let multiplier = await executorContract.currentMultiplier.call();
            assert.equal(multiplier.toNumber(), 10);

        });

    })

    describe("when adding or removing an approved contract", () => {

        it("should not be able to add a contract as an unauthorised address", async function() {

           await assertRevert(executorContract.addApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a contract as the owner", async function() {

            await executorContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await executorContract.getApprovedContracts();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to set a contract's call costs as an unauthorised address", async function() {

            await assertRevert(executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: unauthorisedAddress}));

        });

        it("should not be able to set call costs for a contract which isn't already authorised", async function() {

            await assertRevert(executorContract.setApprovedContractCallCost("0xabc", 0, 40, 20, 1, {from: contractOwner}));

        });

        it("should be able to set a contract's call costs as the owner", async function() {

            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: contractOwner});
            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 1, 30, 10, 1, {from: contractOwner});

            let gasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 40);
            assert.equal(gasCostObject[1], 20);
            assert.equal(gasCostObject[2], 1);

            let secondGasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(secondGasCostObject[0], 30);
            assert.equal(secondGasCostObject[1], 10);
            assert.equal(secondGasCostObject[2], 1);

        });

        it("should not be able to remove a contract's call costs as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract's call costs as an authorised address", async function() {

            await executorContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: contractOwner});
            await executorContract.removeApprovedContractCallCost(subscriptionContract.address, 1, {from: contractOwner});

            let gasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 0);
            assert.equal(gasCostObject[1], 0);
            assert.equal(gasCostObject[2], 0);

            let gasCostObjectTwo = await executorContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(gasCostObjectTwo[0], 0);
            assert.equal(gasCostObjectTwo[1], 0);
            assert.equal(gasCostObjectTwo[2], 0);
        });

        it("should not be able to remove a contract as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract as the owner", async function() {

            await executorContract.removeApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await executorContract.getApprovedContracts();
            assert.equal(approvedArray.length, 0);

        });

    });

    describe("when adding an approved token", () => {

        it("should not be able to add a token as an unauthorised address", async function() {

            await assertRevert(executorContract.addApprovedToken(mockTokenContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a token as an authorised address", async function() {

            await executorContract.addApprovedToken(mockTokenContract.address, {from: contractOwner});

            let isApproved = await executorContract.approvedTokenMapping.call(mockTokenContract.address);
            assert(isApproved);

            let approvedArray = await executorContract.getApprovedTokens();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to remove a token as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedToken(mockTokenContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to remove a token as an authorised address", async function() {

            await executorContract.removeApprovedToken(mockTokenContract.address, {from: contractOwner});

            let approvedObject = await executorContract.approvedTokenMapping.call(mockTokenContract.address);
            assert.equal(approvedObject, 0);

            let approvedArray = await executorContract.getApprovedTokens();
            assert.equal(approvedArray.length, 0);

        });

    });

});