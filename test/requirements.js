import assertRevert from './helpers/assert_revert.js';

var Requirements = artifacts.require('./Requirements.sol');

contract('Requirements', function(accounts) {

    let requirementsContract;
    let gini = 400;
    let divideTotalBy = 15;

    before(async function() {

        requirementsContract = await Requirements.new(gini, divideTotalBy, {from: accounts[0]});

    });

    it("should be able to iniate the contract with the correct variables", async function() {

        let returnedGini = await requirementsContract.giniCoefficient.call();
        let returnedDivideTotalBy = await requirementsContract.divideTotalBy.call();

        assert.equal(returnedGini, gini);
        assert.equal(returnedDivideTotalBy, divideTotalBy);

    });

    it("should not be able to set the gini coefficient as someone other than the owner", async function() {

        await assertRevert(requirementsContract.setGiniCoefficient(0.4, {from: accounts[1]}));

    });

    it("should not be able to set the total to divide by as someone other than the owner", async function() {

        await assertRevert(requirementsContract.setDivideTotalBy(0.9, {from: accounts[1]}));

    });

    it("should be able to set the gini coefficient as the ownner", async function() {

        gini = 500;
        await requirementsContract.setGiniCoefficient(gini, {from: accounts[0]});

    });

    it("should be able to set the total to divide by as the ownner", async function() {

        divideTotalBy = 10;
        await requirementsContract.setDivideTotalBy(divideTotalBy, {from: accounts[0]});

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