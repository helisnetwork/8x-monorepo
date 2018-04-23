import assertRevert from '../helpers/assert_revert.js';
import keccak from '../helpers/keccak.js';

var Plans = artifacts.require("./Plans.sol");
var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");

contract('VolumeSubscription', function(accounts) {

    let contract;
    let planHash;
    let subscriptionHash;
    
    beforeEach(async function() {  
        
        contract = await VolumeSubscription.new();

        let now = Date.now();
        now = now/1000;

        let newPlan = await contract.createPlan(accounts[0], "test.identifier", "Test", "Description", 30, 10, "{}");
        planHash = newPlan.logs[0].args.identifier;

        let newSubscription = await contract.createSubscription(accounts[0], planHash, now, "{}");
        subscriptionHash = newSubscription.logs[0].args.identifier;
          
    });

    it("should have the correct computed subscription hash", async function() {

        let computedHash = keccak(
          ["address", "bytes32"],
          [accounts[0], planHash]
        )

        assert.equal(subscriptionHash, computedHash);
  
    });

    it("should be able to intialise the subscription contract correctly", async function() {

        let owner = await contract.owner.call();
        assert.equal(owner, accounts[0]);

    });

    describe("when updating the data of a subscription", () => {

        it("should be able to update as the owner", async function() {

            await contract.setSubscriptionData(subscriptionHash, "{hey: there}");
        
            let data = await contract.getSubscriptionData(subscriptionHash);
            assert.equal(data, "{hey: there}");
            
        });

        it("should be not be able to update as another user", async function () {

            await assertRevert(contract.setSubscriptionData(subscriptionHash, "{hey: there}", {from: accounts[1]}));

        });

    });

    describe("when terminating a subscription", () => {

        it("should be able to terminate as the owner", async function() {

            let now = Date.now();
            now = parseInt(now/1000);
        
            let termination = await contract.terminateSubscription(subscriptionHash, now);
            assert.equal(termination.logs[0].args.terminationDate, now);
        
            let terminationDate = await contract.getSubscriptionTerminationDate(subscriptionHash);
            assert.equal(terminationDate, now);
            
        });
        
        it("should not be able to terminate multiple times", async function() {
        
            let now = Date.now();
            now = parseInt(now/1000);
        
            let secondDate = new Date(Date.now() + (60*60*1000)).valueOf();
            secondDate = parseInt(secondDate/1000);
        
            await contract.terminateSubscription(subscriptionHash, now);
            await assertRevert(contract.terminateSubscription(subscriptionHash, secondDate));
        });
        
        it("should not be able to terminate from a date in the past", async function() {
        
            let past = new Date(Date.now() - (60*60*1000)).valueOf();
            past = parseInt(past/1000);
        
            await assertRevert(contract.terminateSubscription(subscriptionHash, past));
        
        });
        
        it("should not be able to terminate as another user", async function () {
        
            let now = Date.now();
            now = now/1000;
        
            await assertRevert(contract.terminateSubscription(subscriptionHash, now, {from: accounts[1]}));
            
        });

    });

});