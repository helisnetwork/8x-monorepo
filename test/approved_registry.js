import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var Requirements = artifacts.require("./Requirements.sol");

contract('ApprovedRegistry', function(accounts) {

    let subscriptionContract;
    let approvedRegistryContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let etherSubscriber = accounts[2]; // User paying $100/month subscription worth of ETH
    let tokenSubscriber = accounts[3]; // User paying $100/month subscription directly (probably in DAI)
    let serviceNode = accounts[4]; // Collector party claiming payment
    let unauthorisedAddress = accounts[5]; // Some random address
    let requirementsContract;

    let wrappedEtherContract;
    let transactingCurrencyContract;

    let multiplier = 10;

    before(async function() {

        // Initialise all the other contracts the executor needs in order to function
        requirementsContract = await Requirements.new({from: contractOwner});

        approvedRegistryContract = await ApprovedRegistry.new(requirementsContract.address, {from: contractOwner});
        subscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: contractOwner});

        // Initialise a mock token contract, the owner has the initial supply
        wrappedEtherContract = await WrappedEther.new();
        transactingCurrencyContract = await MockToken.new({from: contractOwner});


    });

    describe("when adding or removing an approved contract", () => {

        it("should not be able to add a contract as an unauthorised address", async function() {

           await assertRevert(approvedRegistryContract.addApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a contract as the owner", async function() {

            await approvedRegistryContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await approvedRegistryContract.getApprovedContracts();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to add a duplicate contract", async function() {

            await assertRevert(approvedRegistryContract.addApprovedContract(subscriptionContract.address, {from: contractOwner}));

        });

        it("should not be able to set a contract's call costs as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: unauthorisedAddress}));

        });

        it("should not be able to set call costs for a contract which isn't already authorised", async function() {

            await assertRevert(approvedRegistryContract.setApprovedContractCallCost("0xabc", 0, 40, 20, 1, {from: contractOwner}));

        });

        it("should be able to set a contract's call costs as the owner", async function() {

            // Random numbers plugged in here since we're going to be removing these and keeping the state fresh
            await approvedRegistryContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: contractOwner});
            await approvedRegistryContract.setApprovedContractCallCost(subscriptionContract.address, 1, 30, 10, 1, {from: contractOwner});

            let gasCostObject = await approvedRegistryContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 40);
            assert.equal(gasCostObject[1], 20);
            assert.equal(gasCostObject[2], 1);

            let secondGasCostObject = await approvedRegistryContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(secondGasCostObject[0], 30);
            assert.equal(secondGasCostObject[1], 10);
            assert.equal(secondGasCostObject[2], 1);

        });

        it("should not be able to remove a contract's call costs as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract's call costs as an authorised address", async function() {

            // State of approved contracts is reset here, and it's a test!
            await approvedRegistryContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: contractOwner});
            await approvedRegistryContract.removeApprovedContractCallCost(subscriptionContract.address, 1, {from: contractOwner});

            let gasCostObject = await approvedRegistryContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 0);
            assert.equal(gasCostObject[1], 0);
            assert.equal(gasCostObject[2], 0);

            let gasCostObjectTwo = await approvedRegistryContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(gasCostObjectTwo[0], 0);
            assert.equal(gasCostObjectTwo[1], 0);
            assert.equal(gasCostObjectTwo[2], 0);
        });

        it("should not be able to remove a contract as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.removeApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract as the owner", async function() {

            await approvedRegistryContract.removeApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await approvedRegistryContract.getApprovedContracts();
            assert.equal(approvedArray.length, 0);

        });

    });

    describe("when adding an approved token", () => {

        it("should not be able to add a token as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.addApprovedToken(transactingCurrencyContract.address, false, {from: unauthorisedAddress}));

        });

        it("should be able to add a token as an authorised address", async function() {

            // We're only adding the token for now since we want to test duplication + other things
            await approvedRegistryContract.addApprovedToken(transactingCurrencyContract.address, false, {from: contractOwner});

            let approvedArray = await approvedRegistryContract.getApprovedTokens();
            assert.equal(approvedArray.length, 1);

        });

        it("should be able to add a duplicate token as an authorised address", async function() {

            await assertRevert(approvedRegistryContract.addApprovedToken(transactingCurrencyContract.address, false, {from: contractOwner}));

        });

        it("should not be able to remove a token as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.removeApprovedToken(transactingCurrencyContract.address, false, {from: unauthorisedAddress}));

        });

        it("should be able to remove a token as an authorised address", async function() {

            // Remove approved tokens to reset the state
            await approvedRegistryContract.removeApprovedToken(transactingCurrencyContract.address, {from: contractOwner});
            await approvedRegistryContract.removeApprovedToken(wrappedEtherContract.address, {from: contractOwner});

            let approvedEthObject = await approvedRegistryContract.approvedTokenMapping.call(wrappedEtherContract.address);
            assert.equal(approvedEthObject, 0);

            let approvedTokenObject = await approvedRegistryContract.approvedTokenMapping.call(transactingCurrencyContract.address);
            assert.equal(approvedTokenObject, 0);

            let approvedArray = await approvedRegistryContract.getApprovedTokens();
            assert.equal(approvedArray.length, 0);

        });

    });


});