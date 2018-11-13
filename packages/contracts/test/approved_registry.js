import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var MockKyber = artifacts.require("./test/MockKyberNetwork.sol");

contract('ApprovedRegistry', function(accounts) {

    let subscriptionContract;
    let approvedRegistryContract;

    let contractOwner = accounts[0]; // Admin role
    let unauthorisedAddress = accounts[5]; // Some random address
    let kyberContract;

    let wrappedEtherContract;
    let transactingCurrencyContract;

    let multiplier = 10;

    before(async function() {

        // Initialise all the other contracts the executor needs in order to function
        kyberContract = await MockKyber.new({ from: contractOwner });

        approvedRegistryContract = await ApprovedRegistry.new(kyberContract.address, { from: contractOwner });
        subscriptionContract = await MockVolumeSubscription.new(approvedRegistryContract.address, { from: contractOwner });

        // Initialise a mock token contract, the owner has the initial supply
        wrappedEtherContract = await WrappedEther.new();
        transactingCurrencyContract = await MockToken.new({ from: contractOwner });


    });

    it("should not be able to overwrite the price as unauthorised user", async function() {

        await assertRevert(approvedRegistryContract.forceUpdateCachedPrice(wrappedEtherContract.address, 10, { from: unauthorisedAddress }));

    });

    it("should be able to overwrite the price as the contract owner", async function() {

        await approvedRegistryContract.forceUpdateCachedPrice(wrappedEtherContract.address, 10);

        let price = await approvedRegistryContract.approvedTokenMapping.call(wrappedEtherContract.address, { from: contractOwner });
        assert.equal(price.toNumber(), 10);

        await approvedRegistryContract.forceUpdateCachedPrice(wrappedEtherContract.address, 0);

    });

    describe("when adding or removing an approved contract", () => {

        it("should not be able to add a contract as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.addApprovedContract(subscriptionContract.address, { from: unauthorisedAddress }));

        });

        it("should be able to add a contract as the owner", async function() {

            await approvedRegistryContract.addApprovedContract(subscriptionContract.address, { from: contractOwner });

            let approvedArray = await approvedRegistryContract.getApprovedContracts();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to add a duplicate contract", async function() {

            await assertRevert(approvedRegistryContract.addApprovedContract(subscriptionContract.address, { from: contractOwner }));

        });

        it("should not be able to remove a contract as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.removeApprovedContract(subscriptionContract.address, { from: unauthorisedAddress }));

        });

        it("should be able to remove a contract as the owner", async function() {

            await approvedRegistryContract.removeApprovedContract(subscriptionContract.address, { from: contractOwner });

            let approvedArray = await approvedRegistryContract.getApprovedContracts();
            assert.equal(approvedArray.length, 0);

            let approvedMapping = await approvedRegistryContract.approvedContractMapping.call(subscriptionContract.address);
            assert.equal(approvedMapping, 0);

        });

    });

    describe("when adding an approved token", () => {

        it("should not be able to add a token as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.addApprovedToken(transactingCurrencyContract.address, false, { from: unauthorisedAddress }));

        });

        it("should be able to add a token as an authorised address", async function() {

            // We're only adding the token for now since we want to test duplication + other things
            await approvedRegistryContract.addApprovedToken(transactingCurrencyContract.address, false, { from: contractOwner });

            let approvedArray = await approvedRegistryContract.getApprovedTokens();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to add a duplicate token as an authorised address", async function() {

            await assertRevert(approvedRegistryContract.addApprovedToken(transactingCurrencyContract.address, false, { from: contractOwner }));

        });

        it("should not be able to remove a token as an unauthorised address", async function() {

            await assertRevert(approvedRegistryContract.removeApprovedToken(transactingCurrencyContract.address, { from: unauthorisedAddress }));

        });

        it("should be able to remove a token as an authorised address", async function() {

            // Remove approved tokens to reset the state
            await approvedRegistryContract.removeApprovedToken(transactingCurrencyContract.address, { from: contractOwner });
            await approvedRegistryContract.removeApprovedToken(wrappedEtherContract.address, { from: contractOwner });

            let approvedEthObject = await approvedRegistryContract.approvedTokenMapping.call(wrappedEtherContract.address);
            assert.equal(approvedEthObject.toNumber(), 0);

            let approvedTokenObject = await approvedRegistryContract.approvedTokenMapping.call(transactingCurrencyContract.address);
            assert.equal(approvedTokenObject.toNumber(), 0);

            let approvedArray = await approvedRegistryContract.getApprovedTokens();
            assert.equal(approvedArray.length, 0);

            let wrappedEtherAddress = await approvedRegistryContract.wrappedEther.call();
            assert.equal(wrappedEtherAddress, 0);

        });

    });


});