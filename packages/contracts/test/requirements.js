import assertRevert from './helpers/assert_revert.js';

var Requirements = artifacts.require('./Requirements.sol');

contract('Requirements', function(accounts) {

    let requirementsContract;

    before(async function() {

        requirementsContract = await Requirements.new(10, {from: accounts[0]});

    });

    it("should be able to return the correct valid stake after 1 day", async function() {

        // @TODO: Implementation

    });

});