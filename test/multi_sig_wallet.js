import assertRevert from './helpers/assert_revert.js';
import { exec } from 'child_process';

var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

contract('MultiSigWallet', function(accounts) {

    let multiSigWallet;
    const requiredConfirmations = 2;

    before(async function() {
        multiSigWallet = await MultiSigWallet.new([accounts[0], accounts[1], accounts[2]], requiredConfirmations);
        assert.ok(multiSigWallet);
    });

    describe("when deploying a new multi-sig wallet", () => {

        it("should not be able to deploy a wallet with no owners", async function() {

            await assertRevert(MultiSigWallet.new([], requiredConfirmations));

        });

        it("should not be able to deploy a wallet with zero confirmations", async function() {

            await assertRevert(MultiSigWallet.new([accounts[0], accounts[1]], 0));

        });

        it("should not be able to deploy a wallet with more confirmations than owners", async function() {

            await assertRevert(MultiSigWallet.new([accounts[0], accounts[1]], 3));

        });

        it("should not be able to deploy a wallet with duplicate", async function() {

            await assertRevert(MultiSigWallet.new([accounts[0], accounts[0], accounts[1]], 2));

        });

        it("should not be able to add an empty owner", async function() {

            await assertRevert(MultiSigWallet.new([0, accounts[0]], 1));

        })

        it("should be able to deploy a wallet with the correct configuration", async function() {

            let wallet = await MultiSigWallet.new([accounts[0], accounts[1], accounts[2]], 2);
            let requiredSignatures = await wallet.requiredCount.call();
            let owners = await wallet.getOwners();
            let transactionCount = await wallet.transactionCount.call();

            assert.ok(wallet);
            assert.equal(requiredSignatures.toNumber(), 2);
            assert.equal(owners.valueOf().length, 3);
            assert.equal(transactionCount, 0);

        });

    });

    describe("when submitting a transaction", () => {

        it("should not be able to submit an empty destination", async function() {

            await assertRevert(multiSigWallet.submitTransaction(0, 0, ""));

        });

        it("should not allow anyone other than an owner to submit a transaction", async function() {

            await assertRevert(multiSigWallet.submitTransaction(accounts[0], 0, "", {from: accounts[5]}));

        });

        it("should be able to submit a valid transaction", async function() {

            await multiSigWallet.submitTransaction(accounts[0], 0, "", {from: accounts[0]});

            let firstTransaction = await multiSigWallet.transactions.call(1);

            assert.equal(firstTransaction[0], accounts[0]);
            assert.equal(firstTransaction[1], 0);
            assert.equal(firstTransaction[2], "0x");
            assert.equal(firstTransaction[3], false);

        });

    });

    describe("when confirming a transaction", () => {

        it("should not be able to confirm a non-existent transaction", async function() {

            await assertRevert(multiSigWallet.confirmTransaction(99, {from: accounts[0]}));

        });

        it("should not be able to confirm as another user", async function() {

            await assertRevert(multiSigWallet.confirmTransaction(1, {from: accounts[5]}));

        });

        it("should not allow an owner to reconfirm a transaction", async function() {

            await assertRevert(multiSigWallet.confirmTransaction(1, {from: accounts[0]}));

        });

        it("should not allow execution of a transaction if the threshold hasn't been met", async function() {

            await multiSigWallet.executeTransaction(1, {from: accounts[0]});
            let firstTransaction = await multiSigWallet.transactions.call(1);
            assert.equal(firstTransaction[3], false);

        });

        it("should allow another owner to confirm a transaction", async function() {

            await multiSigWallet.confirmTransaction(1, {from: accounts[1]});
            let confirmed = await multiSigWallet.confirmations.call(1, accounts[1]);
            assert(confirmed);

        });

    });

    describe("when executing a transaction", () => {

        it("should not allow another user to execute a transaction", async function() {

            await assertRevert(multiSigWallet.executeTransaction(1, {from: accounts[5]}));

        });

        it("should only allow an owner to execute the transaction", async function() {

            await multiSigWallet.executeTransaction(1, {from: accounts[2]});

            let firstTransaction = await multiSigWallet.transactions.call(1);
            assert.equal(firstTransaction[3], true);

        });

    });

    describe("when adding a new owner", () => {

        it("should not be able to add a duplicate owner", async function() {

            await assertRevert(multiSigWallet.addOwner([accounts[0]]));

        });

        it("should not be able to add an empty owner", async function() {

            await assertRevert(multiSigWallet.addOwner(0));

        });

        it("should not be able to add a owner by another user", async function() {

            await assertRevert(multiSigWallet.addOwner([accounts[3]]));

        });

        it("wallet itself should only be able to add a valid new owner", async function() {

            // await multiSigWallet.addOwner([accounts[3]], {from: multiSigWallet.address});

            // let owners = multiSigWallet.getOwners();
            // let isOwner = multiSigWallet.isOwner.call(accounts[3]);

            // assert.equal(owners.count, 4);
            // assert.equal(isOwner);

            // @TODO: Implementation

        });

    });

});