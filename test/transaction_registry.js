import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';

import { newSubscription } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockTransactionRegistry = artifacts.require('./tests/MockTransactionRegistry.sol');
var EightExToken = artifacts.require("./EightExToken.sol");

contract('MockTransactionRegistry', function(accounts) {

    let txRegistryContract;
    let subscriptionContract;
    let tokenContract;

    before(async function() {

        txRegistryContract = await MockTransactionRegistry.new({from: accounts[0]});
        subscriptionContract = await MockVolumeSubscription.new({from: accounts[0]});
        tokenContract = await EightExToken.new({from: accounts[0]});

        // Add accounts[0] as an authorized address
        await txRegistryContract.addAuthorizedAddress(accounts[0], {from: accounts[0]});

    });

    describe("basic tests", () => {

        it("should throw if someone other than the owner tries to set the multiplier", async function() {

            await assertRevert(txRegistryContract.setMultiplier(2, {from: accounts[1]}));

        });

        it("should be able to set the multiplier as the owner", async function() {

            await txRegistryContract.setMultiplier(1, {from: accounts[0]});

            let multiplier = await txRegistryContract.multiplier.call();
            assert.equal(multiplier, 1);

        });
    

    })

    describe("when creating a new payment", () => {

        let now = Date.now();
        let future = parseInt(now/1000) + (30*24*60*60);

        it("should not be able to create with invalid details", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "payment.invalid.details", {from: accounts[0]});

            await assertRevert(txRegistryContract.createNewPayment("abc", subscriptionContract.address, future, 400, {from: accounts[0]}));
            await assertRevert(txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, now - 1000, 400, {from: accounts[0]}));
            await assertRevert(txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, future, 0, {from: accounts[0]}));

        });

        it("should not be able to create as an unauthorized address", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "payment.invalid");
            await assertRevert(txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[1]})); 

        });

        it("should be able to create a valid new payment", async function() {

            let subscriptionHash = await newSubscription(subscriptionContract, tokenContract.address, accounts[0], "payment.valid");
            let result = await txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[0]});
            assert(result);

        });

    });

    describe("when executing a payment", () => {

        it("should throw if being called from an unauthorized address", async function() {



        });
        
        it("should not able to execute for a subscription that doesn't exist", async function() {



        });

        it("should not be able to set the duedate in the past", async function() {



        });

        it("should throw if trying to execute before the payment is due", async function() {



        });

        it('should return false if executing a payment after the specified execution period', async function() {



        });

        it("should be able to execute correctly", async function() {

            

        });

    });

    describe("when removing a claimant", () => {
    
        it("should throw if being called from an unuthorized address", async function() {

            

        });

        it("should be able to remove a claimant", async function() {


        });
    
    });

    describe("when cancelling a payment", ()=> {

        it('should throw if being called from an unauthorized address', async function() {



        });

        it("should be able to cancel a payment", async function() {



        });

    });

});