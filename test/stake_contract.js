import assertRevert from './helpers/assert_revert.js';

var StakeContract = artifacts.require('./StakeContract.sol');
var EightExToken = artifacts.require("./EightExToken.sol");
var MockToken = artifacts.require("./test/MockToken.sol");

contract('StakeContract', function(accounts) {

    let stakeContract;
    let tokenContract;
    let mockToken;

    let firstAccount = accounts[0]; // Admin role
    let secondAccount = accounts[1]; // Authorized address that can slash tokens
    let thirdAccount = accounts[2]; // Staker
    let fourthAccount = accounts[3]; // Random malicious dude

    before(async function() {

        tokenContract = await EightExToken.new({from: firstAccount});
        stakeContract = await StakeContract.new(tokenContract.address, {from: firstAccount});
        mockToken = await MockToken.new({from: firstAccount});

        // Add executor as as authorized to proxy contract
        // Add executor as as authorized to subscription contract
        await stakeContract.addAuthorizedAddress(firstAccount, {from: firstAccount});

        // Transfer tokens to third account
        await tokenContract.transfer(thirdAccount, 100, {from: firstAccount});

        // Give approval of tokens to contract
        await tokenContract.approve(stakeContract.address, 100, {from: thirdAccount});

        // Top up the balance
        let status = await stakeContract.topUpStake(100, mockToken.address, {from: thirdAccount});

    });

    it("should be able to return the correct amount of available tokens", async function() {

        let availableAmount = await stakeContract.getAvailableStake(thirdAccount, mockToken.address, {from: thirdAccount});
        assert.equal(availableAmount.toNumber(), 100);

        let totalAmount = await stakeContract.getTotalStake(thirdAccount, mockToken.address, {from: thirdAccount});
        assert.equal(totalAmount.toNumber(), 100);

        let lockedAmount = await stakeContract.getLockedStake(thirdAccount, mockToken.address, {from: thirdAccount});
        assert.equal(lockedAmount.toNumber(), 0);

    });

    describe("when staking tokens", () => {

        it("should throw when trying to stake as an unauthorized address", async function() {

            await assertRevert(stakeContract.stakeTokens(thirdAccount, mockToken.address, 50, {from: fourthAccount}));

        });

        it("should be able to stake tokens in the contract and show the correct available balance", async function() {

            await stakeContract.stakeTokens(thirdAccount, mockToken.address, 100, {from: firstAccount});
            let availableAmount = await stakeContract.getAvailableStake(thirdAccount, mockToken.address);
            assert.equal(availableAmount.toNumber(), 0);

            let totalAmount = await stakeContract.getTotalStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(totalAmount.toNumber(), 100);

            let lockedAmount = await stakeContract.getLockedStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(lockedAmount.toNumber(), 100);

        });

    });

    describe("when slashing tokens", () => {

        it("should throw if an unauthorized address tries to slash tokens", async function() {

            await assertRevert(stakeContract.slashTokens(thirdAccount, mockToken.address, 50, {from: fourthAccount}));

        });

        it("should not be able to slash unstaked tokens", async function() {

            await assertRevert(stakeContract.slashTokens(thirdAccount, mockToken.address, 150, {from: firstAccount}));

        });

        it("should be able to slash a staked amount of tokens", async function() {

            await stakeContract.slashTokens(thirdAccount, mockToken.address, 50, {from: firstAccount});

            let availableAmount = await stakeContract.getAvailableStake(thirdAccount, mockToken.address);
            assert.equal(availableAmount.toNumber(), 0);

            let totalAmount = await stakeContract.getTotalStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(totalAmount.toNumber(), 50);

            let lockedAmount = await stakeContract.getLockedStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(lockedAmount.toNumber(), 50);

        });

    });

    describe("when transferring tokens", () => {

        it("should throw if transferring from an unauthorised address", async function() {

            await assertRevert(stakeContract.transferStake(thirdAccount, mockToken.address, 150, fourthAccount, {from: fourthAccount}));

        });

        it("should throw if transferring more than is available", async function () {

            await assertRevert(stakeContract.transferStake(thirdAccount, mockToken.address, 75, fourthAccount, {from: firstAccount}));

        });

        it("should be able to transfer from an authorised address", async function() {

            await stakeContract.transferStake(thirdAccount, mockToken.address, 25, fourthAccount, {from: firstAccount});

            let availableAmount = await stakeContract.getAvailableStake(fourthAccount, mockToken.address);
            assert.equal(availableAmount.toNumber(), 25);

            let totalAmount = await stakeContract.getTotalStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(totalAmount.toNumber(), 25);

            let lockedAmount = await stakeContract.getLockedStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(lockedAmount.toNumber(), 25);

        });

    });

    describe('when unstaking tokens', () => {

        it("should throw if the user tries to withdraw staked tokens", async function() {

            await assertRevert(stakeContract.withdrawStake(50, mockToken.address, {from: firstAccount}));

        });

        it("should throw if the user tries to unstake more tokens than they have staked", async function() {

            await assertRevert(stakeContract.unstakeTokens(thirdAccount, mockToken.address, 100, {from: firstAccount}));

        });

        it("should throw when an unauthorized address tries to unstake a user's tokens", async function() {

            await assertRevert(stakeContract.unstakeTokens(thirdAccount, mockToken.address, 25, {from: fourthAccount}));

        });

        it("should be able to unstake a user's tokens from an authorized address", async function() {

            await stakeContract.unstakeTokens(thirdAccount, mockToken.address, 25, {from: firstAccount});

            let availableAmount = await stakeContract.getAvailableStake(thirdAccount, mockToken.address);
            assert.equal(availableAmount.toNumber(), 25);

            let totalAmount = await stakeContract.getTotalStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(totalAmount.toNumber(), 25);

            let lockedAmount = await stakeContract.getLockedStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(lockedAmount.toNumber(), 0);

        });

    });

    describe("when withdrawing tokens", () => {


        it("should throw if a user tries to withdraw more tokens then they have staked", async function() {

            await assertRevert(stakeContract.withdrawStake(100, mockToken.address, {from: thirdAccount}));

        });

        it('should be able to withdraw all the available tokens they have', async function() {

            await stakeContract.withdrawStake(25, mockToken.address, {from: thirdAccount});

            let availableAmount = await stakeContract.getAvailableStake(thirdAccount, mockToken.address);
            assert.equal(availableAmount.toNumber(), 0);

            let totalAmount = await stakeContract.getTotalStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(totalAmount.toNumber(), 0);

            let lockedAmount = await stakeContract.getLockedStake(thirdAccount, mockToken.address, {from: thirdAccount});
            assert.equal(lockedAmount.toNumber(), 0);

        });

    });

});