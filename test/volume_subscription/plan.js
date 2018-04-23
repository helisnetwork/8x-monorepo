import assertRevert from '../helpers/assert_revert.js';
import keccak from '../helpers/keccak.js';

var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");

contract('VolumeSubscription', function(accounts) {

    let contract;
    let planHash;

    beforeEach(async function() {

      contract = await VolumeSubscription.new();

      let newPlan = await contract.createPlan(accounts[0], "test.identifier", "Test", "Description", 30, 10, "{}");
      planHash = newPlan.logs[0].args.identifier;
        
    });

    it("should have the correct computed plan hash", async function() {

        let computedHash = keccak(
          ["address", "string"],
          [accounts[0], "test.identifier"]
        )

        assert.equal(planHash, computedHash);

    });

    it("should be able to intialise the plan contract correctly", async function() {

        let owner = await contract.owner.call();
        assert.equal(owner, accounts[0]);
      
    });

    describe("when creating a new plan", () => {

        it("should be able to create a new plan correctly", async function() {

            let savedPlan = await contract.getPlan.call(planHash)

            assert.equal(savedPlan[0], accounts[0]);
            assert.equal(savedPlan[1], "test.identifier");
            assert.equal(savedPlan[2], "Test");
            assert.equal(savedPlan[3], "Description");
            assert.equal(savedPlan[4], 0);
            assert.equal(savedPlan[5], 30);
            assert.equal(savedPlan[6], 10);
            assert.equal(savedPlan[7], "{}");
        });

        it("should not be able to create a plan without required details", async function() {

            await assertRevert(contract.createPlan(0x0, "test.identifier", "", "", 30, 10, ""));
            await assertRevert(contract.createPlan(accounts[0], "", "", "", 30, 10, ""));
            await assertRevert(contract.createPlan(accounts[0], "test.identifier", "", "", 0, 10, ""));
            await assertRevert(contract.createPlan(accounts[0], "test.identifier", "", "", 30, 0, ""));

        });

        it("should not be able to create a plan with the same identifier", async function() {

            await assertRevert(contract.createPlan(accounts[0], "test.identifier", "", "", 30, 10, ""));

        });

    });

    describe("when updating the owner of a plan", () => {

        it("should be able to update as the owner", async function() {

            await contract.setPlanOwner(planHash, accounts[1], {from: accounts[0]});

            let owner = await contract.getPlanOwner(planHash);
            assert.equal(owner, accounts[1]);

            await contract.setPlanOwner(planHash, accounts[0], {from: accounts[1]});

            owner = await contract.getPlanOwner(planHash);
            assert.equal(owner, accounts[0]);
        
        });

        it("should be not be able to update the owner as another user", async function () {

            await assertRevert(contract.setPlanOwner(planHash, accounts[1], {from: accounts[1]}));

        });
    
    });

    describe("when updating the name of a plan", () => {

        it("should be able to update as the owner", async function() {
            
            let savedPlan = await contract.getPlan.call(planHash)

            await contract.setPlanName(planHash, "Another test", {from: accounts[0]});

            let name = await contract.getPlanName(planHash); 
            assert.equal(name, "Another test");
        
        });

        it("should be not be able to update as another user", async function () {

            await assertRevert(contract.setPlanName(planHash, "Another test", {from: accounts[1]}));
            
        });

    });

    describe("when updating the description of a plan", () => {

        it("should be able to update as the owner", async function() {

            await contract.setPlanDescription(planHash, "Test description");

            let description = await contract.getPlanDescription(planHash);
            assert.equal(description, "Test description");
        
        });

        it("should be not be able to update as another user", async function () {

            await assertRevert(contract.setPlanDescription(planHash, "Test description", {from: accounts[1]}));

        });

    });

    describe("when updating the data of a plan", () => {

        it("should be able to update as the owner", async function() {

            await contract.setPlanData(planHash, "{hey: there}");
        
            let data = await contract.getPlanData(planHash);
            assert.equal(data, "{hey: there}");
            
        });
        
        it("should be not be able to update as another user", async function () {
        
            await assertRevert(contract.setPlanData(planHash, "{hey: there}", {from: accounts[1]}));
        
        });

    });

    describe("when terminating a plan", () => {

        it("should be able to terminate as the owner", async function() {

            let now = Date.now();
            now = parseInt(now/1000);

            let termination = await contract.terminatePlan(planHash, now);
            assert.equal(termination.logs[0].args.terminationDate, now);

            let terminationDate = await contract.getPlanTerminationDate(planHash);
            assert.equal(terminationDate, now);
          
        });

        it("should not be able to terminate multiple times", async function() {

            let now = Date.now();
            now = parseInt(now/1000);

            let secondDate = new Date(Date.now() + (60*60*1000)).valueOf();
            secondDate = parseInt(secondDate/1000);

            await contract.terminatePlan(planHash, now);
            await assertRevert(contract.terminatePlan(planHash, secondDate));

        });
        
        it("should not be able to terminate from a date in the past", async function() {

            let past = new Date(Date.now() - (60*60*1000)).valueOf();
            past = parseInt(past/1000);

            await assertRevert(contract.terminatePlan(planHash, past));

        });

        it("should not be able to terminate as another user", async function () {

            let now = Date.now();
            now = now/1000;

            await assertRevert(contract.terminatePlan(planHash, now, {from: accounts[1]}));
          
        });
    
    });

});
