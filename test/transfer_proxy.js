import assertRevert from './helpers/assert_revert.js';

var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");

contract('TransferProxy', function(accounts) {

    let transferProxyContract;
    let tokenContract;

    beforeEach(async function() {
        transferProxyContract = await TransferProxy.deployed();
        tokenContract = await EightExToken.deployed();
    });

    describe("basic tests", () => {

        it("should throw if an unauthorized address tries to transfer tokens", async function(){

            await assertRevert(transferProxyContract.transferFrom(tokenContract.address, accounts[0], accounts[1], 1000, {from: accounts[0]}));
            await assertRevert(transferProxyContract.transferFrom(tokenContract.address, accounts[1], accounts[2], 1000, {from: accounts[1]}));
            await assertRevert(transferProxyContract.transferFrom(tokenContract.address, accounts[1], accounts[2], 1000, {from: accounts[2]}));

        })

        it("should allow an authorized address to transfer tokens", async function() {

            // Add Accounts[0] as an approved address to make transfers
            await transferProxyContract.addAuthorizedAddress(accounts[0], {from: accounts[0]});

            // Give Accounts[1] an initial balance of 1000
            await tokenContract.transfer(accounts[1], 1000, {from: accounts[0]});

            // Give Transfer Proxy approval to transfer 1000 tokens on behalf of Accounts[1]
            await tokenContract.approve(transferProxyContract.address, 1000, {from: accounts[1]});
            
            // Get the Transfer Proxy to transfer 1000 tokens on behalf of accounts[1] to accounts[2]
            await transferProxyContract.transferFrom(tokenContract.address, accounts[1], accounts[2], 1000, {from: accounts[0]});

            let balance = await tokenContract.balanceOf(accounts[2]);
            assert.equal(balance.toNumber(), 1000);

        });

    });

});