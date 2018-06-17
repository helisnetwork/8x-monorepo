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

            assertRevert(MultiSigWallet.new([], requiredConfirmations));

        });

        it ("should not be able to deploy a wallet with zero confirmations", async function() {

            assertRevert(MultiSigWallet.new([accounts[0], accounts[1]], 0));

        })

        it ("should not be able to deploy a wallet with more confirmations than owners", async function() {

          assertRevert(MultiSigWallet.new([accounts[0], accounts[1]], 3));

      })

    });

});