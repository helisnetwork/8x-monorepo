import assertRevert from './helpers/assert_revert.js';

var Multiplier = artifacts.require('./Multiplier.sol');

contract('Multiplier', function(accounts) {

    let multiplierContract;
    let gini = 400;
    let divideTotalBy = 15;

    before(async function() {

        multiplierContract = await Multiplier.new(gini, divideTotalBy, {from: accounts[0]});

    });

    it("should be able to iniate the contract with the correct variables", async function() {

        let returnedGini = await multiplierContract.giniCoefficient.call();
        let returnedDivideTotalBy = await multiplierContract.divideTotalBy.call();

        assert.equal(returnedGini, gini);
        assert.equal(returnedDivideTotalBy, divideTotalBy);

    });

    it("should not be able to set the gini coefficient as someone other than the owner", async function() {

        await assertRevert(multiplierContract.setGiniCoefficient(0.4, {from: accounts[1]}));

    });

    it("should not be able to set the total to divide by as someone other than the owner", async function() {

        await assertRevert(multiplierContract.setDivideTotalBy(0.9, {from: accounts[1]}));

    });

    it("should be able to set the gini coefficient as the ownner", async function() {

        gini = 500;
        await multiplierContract.setGiniCoefficient(gini, {from: accounts[0]});

    });

    it("should be able to set the total to divide by as the ownner", async function() {

        divideTotalBy = 10;
        await multiplierContract.setDivideTotalBy(divideTotalBy, {from: accounts[0]});

    });

    it("should be able to return the correct valid stake after 1 day", async function() {

        let now = (Date.now() / 1000);
        let stake = await multiplierContract.getMultiplier(
            now,
            now + (60 * 60 * 24),
            now + (60 * 60 * 24 * 5),
            1000
        );
        console.log(JSON.stringify(stake));
        assert.equal(stake.toNumber(), 50);

    });

});