var Plan = artifacts.require("./Plan.sol");

contract('Plan', function(accounts) {

  let instance;

  beforeEach(async function() {
      instance = await Plan.new(accounts[0], "Test", 30, 10);
  });

  it("should be able to intialise correctly", async function() {

      let owner = await instance.owner.call();
      let name = await instance.name.call();
      let interval = await instance.interval.call();
      let amount = await instance.amount.call();

      assert.equal(owner, accounts[0]);
      assert.equal(name, "Test");
      assert.equal(interval, 30);
      assert.equal(amount, 10);
  });

  it("should be able to update the owner", async function() {

    await instance.setOwner(accounts[1], { from: accounts[0] });

    let owner = await instance.owner.call(); 
    assert.equal(owner, accounts[1]);
    
  });

  it("should be not be able to update the owner as another user", async function () {

      try {
        await instance.setOwner(accounts[1], { from: accounts[1] });

        assert.fail('Expected revert not received');
      } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        assert(revertFound, `Expected "revert", got ${error} instead`);
      }

  });

  it("should be able to update the name", async function() {

    await instance.setName("Another test");

    let name = await instance.name.call(); 
    assert.equal(name, "Another test");
    
  });

  it("should be not be able to update the name as another user", async function () {

    try {
      await instance.setName("Another test", { from: accounts[1] });

      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }

  });

  it("should be able to update the description", async function() {

    await instance.setDescription("Test description");

    let description = await instance.description.call(); 
    assert.equal(description, "Test description");
    
  });

  it("should be not be able to update the description as another user", async function () {

    try {
      await instance.setDescription("Test description", { from: accounts[1] });

      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }

  });

  it("should be able to update the identifier", async function() {

    await instance.setIdentifier("test.identifier");

    let identifier = await instance.identifier.call(); 
    assert.equal(identifier, "test.identifier");
    
  });

  it("should be not be able to update the identifier as another user", async function () {

    try {
      await instance.setIdentifier("test.identifier", { from: accounts[1] });

      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }

  });

  it("should be able to terminate the plan as the owner", async function() {

    let now = Date.now();
    now = parseInt(now/1000);

    await instance.terminatePlan(now);

    let terminationDate = await instance.terminationDate.call(); 
    assert.equal(terminationDate, now);
    
  });

  it("should not be able to terminate the plan multiple times", async function() {

    let now = Date.now();
    now = parseInt(now/1000);

    await instance.terminatePlan(now);

    try {
      let secondDate = new Date(Date.now() + (60*60*1000)).valueOf();
      await instance.terminatePlan(secondDate);
      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }

  });
  
  it("should not be able to terminate the plan from a date in the past", async function() {

    let past = new Date(Date.now() - (60*60*1000)).valueOf();
    past = parseInt(past/1000);

    try {
      await instance.terminatePlan(past);
      let terminationDate = await instance.terminationDate.call(); 
      console.log(terminationDate);
      console.log(past);
      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }
    
  });

  it("should not be able to terminate the plan as another user", async function () {

    let now = Date.now();
    now = now/1000;

    try {
      await instance.terminatePlan(now, { from: accounts[1] });

      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }

  });

});
