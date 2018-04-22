import assertRevert from './helpers/assertRevert.js';
import keccak from './helpers/keccak.js';

var Plans = artifacts.require("./Plans.sol");

contract('Plans', function(accounts) {

  let plan;
  let planHash;
  let incrementalIdentifier = "0";

  before(async function() {
      plan = await Plans.deployed();
  });

  beforeEach(async function() {

    incrementalIdentifier = (parseInt(incrementalIdentifier) + 1).toString();

    let newPlan = await plan.createPlan(accounts[0], incrementalIdentifier, "Test", "Description", 30, 10, "{}");
    planHash = newPlan.logs[0].args.identifier;
      
  });

  it("should have the correct computed hash", async function() {

      let computedHash = keccak(
        ["address", "string"],
        [accounts[0], incrementalIdentifier]
      )

      assert.equal(planHash, computedHash);

  });

  it("should be able to intialise the contract correctly", async function() {

    let owner = await plan.owner.call();
    assert.equal(owner, accounts[0]);
    
  });

  it("should not be able to change the owner of the contract as another user", async function() {

    await assertRevert(plan.setOwner(accounts[1], {from: accounts[1]}));
    
  });

  it("should be able to create a new plan correctly", async function() {

      let savedPlan = await plan.getPlan.call(planHash)

      assert.equal(savedPlan[0], accounts[0]);
      assert.equal(savedPlan[1], incrementalIdentifier);
      assert.equal(savedPlan[2], "Test");
      assert.equal(savedPlan[3], "Description");
      assert.equal(savedPlan[4], 0);
      assert.equal(savedPlan[5], 30);
      assert.equal(savedPlan[6], 10);
      assert.equal(savedPlan[7], "{}");
  });

  it("should not be able to create a plan without required details", async function() {
      await assertRevert(plan.createPlan(0x0, "test.identifier", "", "", 30, 10, ""));
      await assertRevert(plan.createPlan(accounts[0], "", "", "", 30, 10, ""));
      await assertRevert(plan.createPlan(accounts[0], "test.identifier", "", "", 0, 10, ""));
      await assertRevert(plan.createPlan(accounts[0], "test.identifier", "", "", 30, 0, ""));
  });

  it("should not be able to create a plan with the same identifier", async function() {
      await assertRevert(plan.createPlan(accounts[0], incrementalIdentifier, "", "", 30, 10, ""));
  });

  it("should be able to update the owner of a plan", async function() {

    await plan.setPlanOwner(planHash, accounts[1], {from: accounts[0]});

    let owner = await plan.getPlanOwner(planHash);
    assert.equal(owner, accounts[1]);

    await plan.setPlanOwner(planHash, accounts[0], {from: accounts[1]});

    owner = await plan.getPlanOwner(planHash);
    assert.equal(owner, accounts[0]);
    
  });

  it("should be not be able to update the owner of a plan as another user", async function () {

      await assertRevert(plan.setPlanOwner(planHash, accounts[1], {from: accounts[1]}));

  });

  it("should be able to update the name of a plan", async function() {

    let savedPlan = await plan.getPlan.call(planHash)

    await plan.setPlanName(planHash, "Another test", {from: accounts[0]});

    let name = await plan.getPlanName(planHash); 
    assert.equal(name, "Another test");
    
  });

  it("should be not be able to update the name of a plan as another user", async function () {

    await assertRevert(plan.setPlanName(planHash, "Another test", {from: accounts[1]}));
  });

  it("should be able to update the description of a plan", async function() {

    await plan.setPlanDescription(planHash, "Test description");

    let description = await plan.getPlanDescription(planHash);
    assert.equal(description, "Test description");
    
  });

  it("should be not be able to update the description of a plan as another user", async function () {

    await assertRevert(plan.setPlanDescription(planHash, "Test description", {from: accounts[1]}));

  });

  it("should be able to update the data of a plan", async function() {

    await plan.setPlanData(planHash, "{hey: there}");

    let data = await plan.getPlanData(planHash);
    assert.equal(data, "{hey: there}");
    
  });

  it("should be not be able to update the data of a plan as another user", async function () {

    await assertRevert(plan.setPlanData(planHash, "{hey: there}", {from: accounts[1]}));

  });

  it("should be able to terminate the plan as the owner", async function() {

    let now = Date.now();
    now = parseInt(now/1000);

    let termination = await plan.terminatePlan(planHash, now);
    assert.equal(termination.logs[0].args.terminationDate, now);

    let terminationDate = await plan.getPlanTerminationDate(planHash);
    assert.equal(terminationDate, now);
    
  });

  it("should not be able to terminate the plan multiple times", async function() {

    let now = Date.now();
    now = parseInt(now/1000);

    let secondDate = new Date(Date.now() + (60*60*1000)).valueOf();
    secondDate = parseInt(secondDate/1000);

    await plan.terminatePlan(planHash, now);
    await assertRevert(plan.terminatePlan(planHash, secondDate));
  });
  
  it("should not be able to terminate the plan from a date in the past", async function() {

    let past = new Date(Date.now() - (60*60*1000)).valueOf();
    past = parseInt(past/1000);

    await assertRevert(plan.terminatePlan(planHash, past));

  });

  it("should not be able to terminate the plan as another user", async function () {

    let now = Date.now();
    now = now/1000;

    await assertRevert(plan.terminatePlan(planHash, now, {from: accounts[1]}));
    
  });

});
