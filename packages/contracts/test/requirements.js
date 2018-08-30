import assertRevert from './helpers/assert_revert.js';

var Requirements = artifacts.require('./Requirements.sol');

contract('Requirements', function(accounts) {

    let requirementsContract;

    before(async function() {

        requirementsContract = await Requirements.new(10, {from: accounts[0]});

    });

    it("should not be able to set the divisor as someone other than the owner", async function() {

        await assertRevert(requirementsContract.setIntervalDivisor(5, {from: accounts[1]}));

    });

    it("should be able to set the divisor as the owner", async function() {

        await assertRevert(requirementsContract.setIntervalDivisor(7, {from: accounts[0]}));

    });

    it("should be able to return the correct valid stake after 1 day", async function() {

        let now = (Date.now() / 1000);
        let stake = await requirementsContract.getMultiplier(
            now,
            now + (60 * 60 * 24),
            now + (60 * 60 * 24 * 5),
            1000
        );
        console.log(JSON.stringify(stake));
        assert.equal(stake.toNumber(), 50);

    });

});