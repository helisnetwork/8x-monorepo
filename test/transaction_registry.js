import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';

import { newSubscription } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var TransactionRegistry = artifacts.require('./TransactionRegistry.sol');
var EightExToken = artifacts.require("./EightExToken.sol");


contract('TransactionRegistry', function(accounts) {

    let txRegistryContract;
    let subscriptionContract;
    let tokenContract;

    before(async function() {

        txRegistryContract = await TransactionRegistry.new({from: accounts[0]});
        subscriptionContract = await MockVolumeSubscription.new({from: accounts[0]});
        tokenContract = await EightExToken.new({from: accounts[0]});

        // Add accounts[0] as an authorized address
        await txRegistryContract.addAuthorizedAddress(accounts[0], {from: accounts[0]});

    });

    describe("when creating a new payment", () => {

        let now = Date.now();
        let future = parseInt(now/1000) + (30*24*60*60);

        it("should not be able to create with an invalid subscriptions", async function() {

            await assertRevert(txRegistryContract.createNewPayment("abc", subscriptionContract.address, future, 400, {from: accounts[0]}));

        });

        it("should not be able to create with invalid details", async function() {

            let subscriptionHash = await newSubscription(contract, tokenContract.address, accounts[0], "payment.invalid.details", {from: accounts[0]});

            await assertRevert(txRegistryContract.createNewPayment("abc", subscriptionContract.address, future, 400, {from: accounts[0]}));
            await assertRevert(txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, now - 1000, 400, {from: accounts[0]}));
            await assertRevert(txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, future, 0, {from: accounts[0]}));

        });

        it("should not be able to create as an unauthorized address", async function() {

            let subscriptionHash = await newSubscription(contract, tokenContract.address, accounts[0], "payment.valid");
            await assertRevert(txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[1]})); 

        });

        it ("should be able to create a valid new payment", async function() {

            let subscriptionHash = await newSubscription(contract, tokenContract.address, accounts[0], "payment.valid");
            let result = await txRegistryContract.createNewPayment(subscriptionHash, subscriptionContract.address, future, 400, {from: accounts[0]});
            assert(result);

        });

    });

    describe("when claiming a payment", () => {


    });

    describe("when executing a payment", () => {


    });

    describe("when updating for a future payment", () => {


    });

});