import assertRevert from './helpers/assertRevert.js';
import keccak from './helpers/keccak.js';

var Plans = artifacts.require("./Plans.sol");
var Subscriptions = artifacts.require("./Subscriptions.sol");

contract('Subscriptions', function(accounts) {

    let planContract;
    let planHash;

    let subscriptionContract;
    let subscriptionHash;

    before(async function() {
        planContract = await Plans.deployed();
        subscriptionContract = await Subscriptions.new(planContract.address);

        let newPlan = await planContract.createPlan(accounts[0], "test.identifier", "Test", "Description", 30, 10, "{}");
        planHash = newPlan.logs[0].args.identifier;
    });

    beforeEach(async function() {    

        let now = Date.now();
        now = now/1000;

        let newSubscription = await subscriptionContract.createSubscription(accounts[0], planHash, now, "{}");
        subscriptionHash = newSubscription.logs[0].args.identifier;
          
    });

    it("should have the correct computed hash", async function() {

        let computedHash = keccak(
          ["address", "bytes32"],
          [accounts[0], planHash]
        )
        
        assert.equal(subscriptionHash, computedHash);
  
    });

});