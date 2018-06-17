import assertRevert from './helpers/assert_revert.js';

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

        it("should be able to deploy a wallet with the correct configuration", async function() {

            let wallet = await MultiSigWallet.new([accounts[0], accounts[1], accounts[2]], 2);
            let requiredSignatures = await wallet.requiredCount.call();
            let owners = await wallet.getOwners();

            assert.ok(wallet);
            assert.equal(requiredSignatures.toNumber(), 2);
            assert.equal(owners.valueOf().length, 3);

        });

    });

});