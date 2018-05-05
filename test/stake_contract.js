import assertRevert from './helpers/assert_revert.js';

var StakeContract = artifacts.require('./StakeContract.sol');
var EightExToken = artifacts.require("./EightExToken.sol");


contract('StakeContract', function(accounts) {

    let stakeContract;
    let tokenContract;

    let firstAccount = accounts[0]; // Admin role
    let secondAccount = accounts[1]; // Authorized address that can slash tokens
    let thirdAccount = accounts[2]; // Staker
    let fourthAccount = accounts[3]; // Random malicious dude

    let planHash;

    before(async function() {

        tokenContract = await EightExToken.new({from: firstAccount});
        stakeContract = await StakeContract.new(tokenContract.address, {from: firstAccount});

        // Add executor as as authorized to proxy contract
        // Add executor as as authorized to subscription contract
        await stakeContract.addAuthorizedAddress(firstAccount, {from: firstAccount});

        // Transfer tokens to third account
        await tokenContract.transfer(thirdAccount, 100, {from: firstAccount});

        // Stake tokens in contract
        await tokenContract.transfer(stakeContract.address, 100, {from: thirdAccount});

    });

    it("should be able to return the correct amount of available tokens", async function() {

        let availableAmount = await stakeContract.getAvailableStake(thirdAccount.address);
        assert.equal(availableAmount, 100);

    });

    describe("when staking tokens", () => {

        it("should throw when trying to stake as an unauthorized address", async function() {

            await assertRevert(stakeContract.stakeTokens(thirdAccount, 50, {from: fourthAccount}));

        });

        it("should be able to stake tokens in the contract and show the correct available balance", async function() {

            await stakeContract.stakeTokens(thirdAccount, 100, {from: firstAccount});
            let availableAmount = await stakeContract.getAvailableStake(thirdAccount.address);
            assert.equal(availableAmount, 0);

        });

    });

    describe("when slashing tokens", () => {

        it("should throw if an unauthorized address tries to slash tokens", async function() {

            await assertRevert(stakeContract.slashTokens(thirdAccount, 50, {from: fourthAccount}));

        });

        it("should not be able to slash unstaked tokens", async function() {

            await assertRevert(stakeContract.slashTokens(thirdAccount, 100, {from: firstAccount}));

        });

        it("should be able to slash a staked amount of tokens", async function() {

            await assertRevert(stakeContract.slashTokens(thirdAccount, 50, {from: firstAccount}));
        
        });

    });

    describe('when unstaking tokens', () => {

        it("should throw if the user tries to withdraw staked tokens", async function() {

            await assertRevert(stakeContract.withdrawStake(50, {from: firstAccount}));
    
        });

        it("should throw if the user tries to unstake more tokens than they have staked", async function() {

            await assertRevert(stakeContract.unstakeTokens(100, {from: firstAccount}));
    
        });
        
        it("should throw when an unauthorized address tries to unstake a user's tokens", async function() {
    
            await assertRevert(stakeContract.unstakeTokens(thirdAccount, 50, {from: fourthAccount}));
    
        });
    
        it("should be able to unstake a user's tokens from an authorized address", async function() {
    
            await stakeContract.unstakeTokens(thirdAccount, 50, {from: firstAccount});
            let availableAmount = await stakeContract.getAvailableStake(thirdAccount.address);
            assert.equal(availableAmount, 50);
    
        });

    });

    describe("when withdrawing tokens", () => {


        it("should throw if a user tries to withdraw more tokens then they have staked", async function() {

            await assertRevert(stakeContract.withdrawStake(100, {from: thirdAccount}));

        });

        it('should be able to withdraw all the available tokens they have', async function() {

            await assertRevert(stakeContract.withdrawStake(50, {from: thirdAccount}));

        });

    });

});