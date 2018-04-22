import assertRevert from '../helpers/assert_revert.js';

var TransferProxy = artifacts.require("./TransferProxy.sol");

contract('TransferProxy', function(accounts) {

    let transferProxyContract;

    before(async function() {
        transferProxyContract = await TransferProxy.deployed();
    });

    describe("while adding an authorized address", () => { 

        it("should throw if not called by the owner", async function() {
            // Accounts[1] shouldn't be able to add Accounts[1] since it's not authorized
            await assertRevert(transferProxyContract.addAuthorizedAddress(accounts[1], {from: accounts[1]}));
        });

        it("should allow the owner to add an authorized address", async function() {
            // Accounts[0] is being added as an authorized address since it's only an owner
            await transferProxyContract.addAuthorizedAddress(accounts[0], {from: accounts[0]});

            let isAuthorized = await transferProxyContract.authorized.call(accounts[0]);
            assert(isAuthorized);
        })

        it("should not allow an authorized address to add a duplicate address", async function() {
            // Accounts[0] shouldn't be able to add Accounts[0] as an authorized address since it's already been added
            await assertRevert(transferProxyContract.addAuthorizedAddress(accounts[0], {from: accounts[0]}));
        });

    });

    describe("while removing an authorized address", () => { 

        it("should throw if not called by the owner", async function() {
            // Accounts[1] shouldn't be able to remove Accounts[0] since it's not authorized
            await assertRevert(transferProxyContract.removeAuthorizedAddress(accounts[0], {from: accounts[1]}));
        });

        it("should allow the owner to remove an authorized address", async function() {
            // Accounts[0] is removing itself as an authorized address
            await transferProxyContract.removeAuthorizedAddress(accounts[0], {from: accounts[0]});

            let isAuthorized = await transferProxyContract.authorized.call(accounts[0]);
            assert(!isAuthorized);
        });

        it("should now allow the owner to remove a non-authorized address", async function() {
            // Accounts[0] is trying to remove Accounts[1] which isn't authorized
            await assertRevert(transferProxyContract.removeAuthorizedAddress(accounts[1], {from: accounts[0]}));
        });

    });

    describe("while getting authorized addresses", async function() {

        it("should be able to return all the authorized addresses", async function() {
            // @TODO: Change this to 1 once you add the deploy script
            let initialCount = await transferProxyContract.getAuthorizedAddresses();
            assert.equal(initialCount.length, 0);

            await transferProxyContract.addAuthorizedAddress(accounts[0], {from: accounts[0]});
            
            let secondCount = await transferProxyContract.getAuthorizedAddresses();
            assert.equal(secondCount.length, 1);

            await transferProxyContract.removeAuthorizedAddress(accounts[0], {from: accounts[0]});

            let thirdCount = await transferProxyContract.getAuthorizedAddresses();
            assert.equal(thirdCount.length, 0);

        });

    });

});