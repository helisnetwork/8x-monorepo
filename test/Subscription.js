import assertRevert from './helpers/assertRevert.js';
import keccak from './helpers/keccak.js';

var Plans = artifacts.require("./Plans.sol");
var Subscriptions = artifacts.require("./Subscriptions.sol");

contract('Subscriptions', function(accounts) {

    let planContract;
    let planHash;

    let subscriptionContract;
    let subscriptionHash;
    
    beforeEach(async function() {  
        
        planContract = await Plans.new();
        subscriptionContract = await Subscriptions.new(planContract.address);

        let now = Date.now();
        now = now/1000;

        let newPlan = await planContract.createPlan(accounts[0], "test.identifier", "Test", "Description", 30, 10, "{}");
        planHash = newPlan.logs[0].args.identifier;

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

    it("should be able to intialise the contract correctly", async function() {

        let owner = await subscriptionContract.owner.call();
        assert.equal(owner, accounts[0]);
        console.log("Contract owner is: " + owner);
    });
    
    it("should not be able to change the owner of the contract as another user", async function() {

        await assertRevert(subscriptionContract.setOwner(accounts[1], {from: accounts[1]}));
    
    });

});