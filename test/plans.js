import assertRevert from './helpers/assertRevert.js';
import abi from 'ethereumjs-abi';

var Plans = artifacts.require("./Plans.sol");

contract('Plans', function(accounts) {

  let instance;
  let planHash;
  let incrementalIdentifier = "0";

  before(async function() {
      instance = await Plans.deployed();
  });

  beforeEach(async function() {

    incrementalIdentifier = (parseInt(incrementalIdentifier) + 1).toString();

    let newPlan = await instance.createPlan(accounts[0], incrementalIdentifier, "Test", "Description", 30, 10, "{}");
    planHash = newPlan.logs[0].args.identifier;
      
  });

  it("should have the correct computed hash", async function() {

      let computedHash = "0x" + abi.soliditySHA3(
        ["address", "string"],
        [accounts[0], incrementalIdentifier]
      ).toString('hex');

      assert.equal(planHash, computedHash);

  });

  it("should be able to intialise the contract correctly", async function() {

    let owner = await instance.owner.call();
    assert.equal(owner, accounts[0]);
    
  });

  it("should not be able to change the owner of the contract as another user", async function() {

    await assertRevert(instance.setOwner(accounts[1], {from: accounts[1]}));
    
  });

  it("should be able to create a new plan correctly", async function() {

      let savedPlan = await instance.getPlan.call(planHash)

      assert.equal(savedPlan[0], accounts[0]);
      assert.equal(savedPlan[1], incrementalIdentifier);
      assert.equal(savedPlan[2], "Test");
      assert.equal(savedPlan[3], "Description");
      assert.equal(savedPlan[4], 0);
      assert.equal(savedPlan[5], 30);
      assert.equal(savedPlan[6], 10);
      assert.equal(savedPlan[7], "{}");
  });

  it("should not be able to create a plan with empty details", async function() {
      await assertRevert(instance.createPlan(0x0, "test.identifier", "", "", 30, 10, ""));
      await assertRevert(instance.createPlan(accounts[0], "", "", "", 30, 10, ""));
      await assertRevert(instance.createPlan(accounts[0], "test.identifier", "", "", 0, 10, ""));
      await assertRevert(instance.createPlan(accounts[0], "test.identifier", "", "", 30, 0, ""));
  });

  it("should not be able to create a plan with the same identifier", async function() {
      await assertRevert(instance.createPlan(accounts[0], incrementalIdentifier, "", "", 30, 10, ""));
  });

  it("should be able to update the owner of a plan", async function() {

    await instance.setPlanOwner(planHash, accounts[1], {from: accounts[0]});

    let owner = await instance.getPlanOwner(planHash);
    assert.equal(owner, accounts[1]);

    await instance.setPlanOwner(planHash, accounts[0], {from: accounts[1]});

    owner = await instance.getPlanOwner(planHash);
    assert.equal(owner, accounts[0]);
    
  });

  it("should be not be able to update the owner of a plan as another user", async function () {

      await assertRevert(instance.setPlanOwner(planHash, accounts[1], {from: accounts[1]}));

  });

  it("should be able to update the name of a plan", async function() {

    let savedPlan = await instance.getPlan.call(planHash)

    await instance.setPlanName(planHash, "Another test", {from: accounts[0]});

    let name = await instance.getPlanName(planHash); 
    assert.equal(name, "Another test");
    
  });

  it("should be not be able to update the name of a plan as another user", async function () {

    await assertRevert(instance.setPlanName(planHash, "Another test", {from: accounts[1]}));
  });

  it("should be able to update the description of a plan", async function() {

    await instance.setPlanDescription(planHash, "Test description");

    let description = await instance.getPlanDescription(planHash);
    assert.equal(description, "Test description");
    
  });

  it("should be not be able to update the description of a plan as another user", async function () {

    await assertRevert(instance.setPlanDescription(planHash, "Test description", {from: accounts[1]}));

  });

  it("should be able to update the data of a plan", async function() {

    await instance.setPlanData(planHash, "{hey: there}");

    let data = await instance.getPlanData(planHash);
    assert.equal(data, "{hey: there}");
    
  });

  it("should be not be able to update the data of a plan as another user", async function () {

    await assertRevert(instance.setPlanData(planHash, "{hey: there}", {from: accounts[1]}));

  });

  it("should be able to terminate the plan as the owner", async function() {

    let now = Date.now();
    now = parseInt(now/1000);

    let termination = await instance.terminatePlan(planHash, now);
    assert.equal(termination.logs[0].args.terminationDate, now);

    let terminationDate = await instance.getPlanTerminationDate(planHash);
    assert.equal(terminationDate, now);
    
  });

  it("should not be able to terminate the plan multiple times", async function() {

    let now = Date.now();
    now = parseInt(now/1000);

    let secondDate = new Date(Date.now() + (60*60*1000)).valueOf();
    secondDate = parseInt(secondDate/1000);

    await instance.terminatePlan(planHash, now);
    await assertRevert(instance.terminatePlan(planHash, secondDate));
  });
  
  it("should not be able to terminate the plan from a date in the past", async function() {

    let past = new Date(Date.now() - (60*60*1000)).valueOf();
    past = parseInt(past/1000);

    await assertRevert(instance.terminatePlan(planHash, past));

  });

  it("should not be able to terminate the plan as another user", async function () {

    let now = Date.now();
    now = now/1000;

    await assertRevert(instance.terminatePlan(planHash, now, {from: accounts[1]}));
    
  });

});
