import assertRevert from './helpers/assert_revert.js';
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

    });

    it("should not be able to change the PLAN_CONTRACT of the subscription as another user", async function() {

        let newPlanContract = await Plans.new();
        let newPlan = await newPlanContract.createPlan(accounts[1], "test.identifier", "Test", "Description", 30, 10, "{}", {from: accounts[1]});
        await assertRevert(subscriptionContract.setPlan(accounts[1], {from: accounts[1]}));
    
    });

    describe("when updating the data of a subscription", () => {

        it("should be able to update as the owner", async function() {

            await subscriptionContract.setSubscriptionData(subscriptionHash, "{hey: there}");
        
            let data = await subscriptionContract.getSubscriptionData(subscriptionHash);
            assert.equal(data, "{hey: there}");
            
        });

        it("should be not be able to update as another user", async function () {

            await assertRevert(subscriptionContract.setSubscriptionData(subscriptionHash, "{hey: there}", {from: accounts[1]}));

        });

    });

    describe("when terminating a subscription", () => {

        it("should be able to terminate as the owner", async function() {

            let now = Date.now();
            now = parseInt(now/1000);
        
            let termination = await subscriptionContract.terminateSubscription(subscriptionHash, now);
            assert.equal(termination.logs[0].args.terminationDate, now);
        
            let terminationDate = await subscriptionContract.getSubscriptionTerminationDate(subscriptionHash);
            assert.equal(terminationDate, now);
            
        });
        
        it("should not be able to terminate multiple times", async function() {
        
            let now = Date.now();
            now = parseInt(now/1000);
        
            let secondDate = new Date(Date.now() + (60*60*1000)).valueOf();
            secondDate = parseInt(secondDate/1000);
        
            await subscriptionContract.terminateSubscription(subscriptionHash, now);
            await assertRevert(subscriptionContract.terminateSubscription(subscriptionHash, secondDate));
        });
        
        it("should not be able to terminate from a date in the past", async function() {
        
            let past = new Date(Date.now() - (60*60*1000)).valueOf();
            past = parseInt(past/1000);
        
            await assertRevert(subscriptionContract.terminateSubscription(subscriptionHash, past));
        
        });
        
        it("should not be able to terminate as another user", async function () {
        
            let now = Date.now();
            now = now/1000;
        
            await assertRevert(subscriptionContract.terminateSubscription(subscriptionHash, now, {from: accounts[1]}));
            
        });

    });

});