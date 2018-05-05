import assertRevert from './helpers/assert_revert.js';

var StakeContract = artifacts.require('./StakeContract.sol');
var EightExToken = artifacts.require("./EightExToken.sol");


contract('StakeContract', function(accounts) {

    let stakeContract;
    let tokenContract;

    let firstAccount = accounts[0]; // Admin role
    let secondAccount = accounts[1]; // Authorized address that can slash tokens
    let thirdAccount = accounts[2]; // Staker

    let planHash;

    before(async function() {

        stakeContract = await StakeContract.new({from: firstAccount});
        tokenContract = await EightExToken.new({from: firstAccount});

        // Add executor as as authorized to proxy contract
        // Add executor as as authorized to subscription contract
        await stakeContract.addAuthorizedAddress(executorContract.address, {from: firstAccount});

        // Transfer tokens to third account
        await tokenContract.transfer(thirdAccount, 100, {from: firstAccount});

        // Stake tokens in contract
        await tokenContract.transfer(stakeContract.address, 100, {from: thirdAccount});

    });

    it("should be able to return the correct amount of staked tokens", async function() {

        // @TODO: Implementation

    });

    it("should throw when trying to stake on behalf of someone else", async function() {

        // @TODO: Implementation

    });

    it("should be able to stake tokens in the contract and show the correct available balance", async function() {

        // @TODO: Implementation

    });

    it("should throw if an unauthorized address tries to slash tokens", async function() {

        // @TODO: Implementation

    });

    it("should throw if the user tries to withdraw staked tokens", async function() {

        // @TODO: Implementation

    });
    
    it("should throw when an unauthorized address treis to unstake a user's tokens", async function() {

        // @TODO: Implementation

    });

    it("should be able to unstake a user's tokens from an authorized address", async function() {

        // @TODO: Implementation

    });

    it("should throw if a user tries to withdraw more tokens then they have staked", async function() {

        // @TODO: Implementation

    });

    it('should be able to withdraw all the available tokens they have', async function() {

        // @TODO: Implementation

    });

});