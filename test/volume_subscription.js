import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var Requirements = artifacts.require("./Requirements.sol");

contract('VolumeSubscription', function(accounts) {

    let contract;
    let token;

    let contractOwner = accounts[0]; // Owner of the actual contract
    let executorContract = accounts[1]; // Authorized address that can create plans and subscriptions
    let business = accounts[2]; // The business who has a subscription they want to earn money from
    let subscriber = accounts[3]; // The user who is paying the business
    let unauthorizedAddress = accounts[4]; // Someone random
    let approvedRegistryContract;
    let requirementsContract;

    before(async function() {

        requirementsContract = await Requirements.new({from: contractOwner});
        approvedRegistryContract = await ApprovedRegistry.new(requirementsContract.address, {from: contractOwner});

        contract = await MockVolumeSubscription.new(approvedRegistryContract.address, {from: accounts[0]});
        token = await EightExToken.new({from: accounts[0]});

        await contract.addAuthorizedAddress(executorContract);

    });

    describe("when deploying the contract", () => {

        it("should have the correct owner set", async function() {

            let owner = await contract.owner.call();
            assert.equal(owner, accounts[0]);

        });

        it("should not have an unauthorized address as an authorized address", async function() {

            let authorized = await contract.authorized.call(unauthorizedAddress);
            assert(!authorized);

        });

        it("should have the executor contract as an authorized address", async function() {

            let authorized = await contract.authorized.call(executorContract);
            assert(authorized);

        });

    });

    describe("when creating a new plan", () => {

        it("should throw when creating a plan with an invalid owner address", async function() {

            await assertRevert(
              contract.createPlan(
                0, token.address, "plan.new.incorrect", "test", "", 30, 100, 5, "{}", {from: business}
              )
            );

        });

        it("should throw when creating a plan with an invalid identifier", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "", "test", "", 30, 100, 5, "{}", {from: business}
              )
            );

        });

        it("should throw when creating a plan with no token address", async function() {

            await assertRevert(
                contract.createPlan(
                    business, 0, "plan.new.no_token", "test", "", 30, 100, 10, "{}", {from: business}
                )
            );

        });

        it("should throw when creating a plan with an unauthorised token", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "plan.new", "test", "", 30, 100, 10, "{}", {from: business}
              )
            );

        });

        it("should throw when creating a plan with the interval set to 0", async function() {

            await assertRevert(
            contract.createPlan(
              business, token.address, "plan.new.incorrect", "test", "", 0, 100, 5, "{}", {from: business}
            )
          );

        });

        it("should throw when creating a plan with the amount set to 0", async function() {

          await assertRevert(
            contract.createPlan(
              business, token.address, "plan.new.incorrect", "test", "", 30, 0, 5, "{}", {from: business}
            )
          );

        });


        it("should throw when creating a plan with a fee set to 0", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "plan.new.incorrect", "test", "", 30, 100, 0, "{}", {from: business}
              )
            );

        });

        it("should throw when creating a plan with a fee greater than or equal to the amount", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "plan.new.incorrect", "test", "", 30, 100, 100, "{}", {from: business}
              )
            );

        });

        it("should be able to create a new plan correctly", async function() {

            await approvedRegistryContract.addApprovedToken(token.address, {from: contractOwner});

            let newPlan = await contract.createPlan(
              business, token.address, "plan.new", "test", "", 30, 100, 10, "{}", {from: business}
            )

            let planHash = newPlan.logs[0].args.identifier;
            let plan = await contract.plans.call(planHash);

            assert.equal(plan[0], business);
            assert.equal(plan[1], token.address);
            assert.equal(plan[2], "plan.new");
            assert.equal(plan[3], "test");
            assert.equal(plan[4], "");
            assert.equal(plan[5], 30);
            assert.equal(plan[6], 100);
            assert.equal(plan[7], 10);
            assert.equal(plan[8], "{}");

            let computedHash = keccak(
              ["address", "address", "string", "string", "string", "uint", "uint", "uint", "string"],
              [business, token.address, "plan.new", "test", "", 30, 100, 10, "{}"]
            );

            assert.equal(computedHash, planHash);

        });

        it("should be able to create a new plan with duplicate details", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "plan.new", "test", "", 30, 100, 10, "{}", {from: business}
              )
            );

        });

    });

    describe("when updating a plan", () => {

      let newPlan;
      let planHash;

        before(async function() {

            newPlan = await contract.createPlan(
              business, token.address, "plan.update", "test", "", 30, 100, 10, "{}", {from: business}
            );

            planHash = newPlan.logs[0].args.identifier;

        });

        it("should throw when setting the owner from an unauthorized address", async function() {

            await assertRevert(contract.setPlanOwner(planHash, accounts[5], {from: unauthorizedAddress}));

        });

        it("should be able to update the owner", async function() {

            await contract.setPlanOwner(planHash, accounts[5], {from: business});

            let returnedPlan = await contract.plans.call(planHash);
            assert(returnedPlan[0], accounts[5]);

            await contract.setPlanOwner(planHash, business, {from: accounts[5]});

        });

        it("should throw when setting the name from an unauthorized address", async function() {

            await assertRevert(contract.setPlanName(planHash, "Test", {from: unauthorizedAddress}));

        });

        it("should be able to update the name", async function() {

            await contract.setPlanName(planHash, "Test", {from: business});

            let returnedPlan = await contract.plans.call(planHash);
            assert(returnedPlan[3], "Test");

        });

        it("should throw when setting the description from an unauthorized address", async function() {

            await assertRevert(contract.setPlanDescription(planHash, "This is a long description.", {from: unauthorizedAddress}));

        });

        it("should be able to update the description", async function() {

            await contract.setPlanDescription(planHash, "This is a long description.", {from: business});

            let returnedPlan = await contract.plans.call(planHash);
            assert(returnedPlan[4], "This is a long description.");

        });

        it("should throw when setting the data from an unauthorized address", async function() {

            await assertRevert(contract.setPlanData(planHash, "{foo: bar}", {from: unauthorizedAddress}));

        });

        it("should be able to update the name", async function() {

            await contract.setPlanData(planHash, "{foo: bar}", {from: business});

            let returnedPlan = await contract.plans.call(planHash);
            assert(returnedPlan[8], "{foo: bar}");

        });

    });

    describe("when terminating a plan", () => {

        let newPlan;
        let planHash;

        before(async function() {

            newPlan = await contract.createPlan(
              business, token.address, "plan.terminate", "test", "", 30, 100, 10, "{}", {from: business}
            );

            planHash = newPlan.logs[0].args.identifier;

        });

        it("should throw when terminating a plan from an unauthorized address", async function() {

            let terminationDate = Date.now();
            terminationDate = parseInt(terminationDate/1000) + (60*60*24);
            await assertRevert(contract.terminatePlan(planHash, terminationDate, {from: unauthorizedAddress}));

        });

        it("should throw when terminating a plan with the termination date in the past", async function() {

            let terminationDate = Date.now();
            terminationDate = parseInt(terminationDate/1000) - (60*60*24);
            await assertRevert(contract.terminatePlan(planHash, terminationDate, {from: business}));

        });

        it("should be able to terminate a plan", async function() {

            let terminationDate = Date.now();
            terminationDate = parseInt(terminationDate/1000) + (60*60*24);
            await contract.terminatePlan(planHash, terminationDate, {from: business});

            let plan = await contract.plans.call(planHash);
            assert.equal(plan[9], terminationDate);

        });

    });

    describe("when creating a new subscription", () => {

        let newPlan;
        let planHash;
        let subscriptionHash;

        let now = parseInt(Date.now()/1000);
        let futureDate = now + (60*60*24);

        before(async function() {

            newPlan = await contract.createPlan(
              business, token.address, "subscription.new", "test", "", 30, 100, 10, "{}", {from: business}
            );

            planHash = newPlan.logs[0].args.identifier;

        });

        it("should not be able to create with an invalid plan hash", async function() {

            let incorrectHash = keccak(
              ["string"],
              ["test"]
            );

            await assertRevert(contract.createSubscription(incorrectHash, "{}", {from: subscriber}));

        });

        it("should be able to create a subscription from an authorized address", async function() {

            await contract.setTime(now);

            let newSubscription = await contract.createSubscription(
              planHash, "{}", {from: subscriber}
            );

            subscriptionHash = newSubscription.logs[0].args.identifier;
            let subscription = await contract.subscriptions.call(subscriptionHash);

            assert.equal(subscription[0], subscriber);
            assert.equal(subscription[1], token.address);
            assert.equal(subscription[2], planHash);
            assert.equal(subscription[3], 0);
            assert.equal(subscription[4], 0);
            assert.equal(subscription[5], "{}");

            let computedHash = keccak(
              ["address", "bytes32", "uint"],
              [subscriber, planHash, now]
            );

            assert.equal(computedHash, subscriptionHash);

        });

        it("should throw when trying to resubscribe with an existing active subscription", async function() {

            await assertRevert(contract.createSubscription(
                planHash, "{}", {from: subscriber}
            ));

        });

        it("should not be able to set the start date as the subscriber", async function() {

            await assertRevert(contract.setStartDate(futureDate, subscriptionHash, {from: subscriber}));

        });

        it("should not be able to set the start date as the business", async function() {

            await assertRevert(contract.setStartDate(futureDate, subscriptionHash, {from: business}));

        });

         it("should not be able to set the start date in the past", async function() {

            await assertRevert(contract.setStartDate(now - 1000, subscriptionHash, {from: executorContract}));

        });

        it("should be able to set the start date from the executor", async function() {

            await contract.setStartDate(futureDate, subscriptionHash, {from: executorContract});

            let subscription = await contract.subscriptions.call(subscriptionHash)
            assert.equal(subscription[3], futureDate);

        });

        it("should not be able to re-set the start date after it's already been set", async function() {

            await assertRevert(contract.setStartDate(futureDate + 100, subscriptionHash, {from: executorContract}));

        });

    });

    describe("when updating a subscription", () => {

        let newPlan;
        let planHash;
        let subscriptionHash;

        let futureDate = Date.now();
        futureDate = parseInt(futureDate/1000) + (60*60*24);

        before(async function() {

            newPlan = await contract.createPlan(
              business, token.address, "subscription.update", "test", "", 30, 100, 10, "{}", {from: business}
            );

            planHash = newPlan.logs[0].args.identifier;

            let newSubscription = await contract.createSubscription(
              planHash, "{}", {from: subscriber}
            );

            subscriptionHash = newSubscription.logs[0].args.identifier;

        });

        it("should throw when upadating the data from an unauthorized address", async function() {

            await assertRevert(contract.setSubscriptionData(subscriptionHash, "{foo: bar}", {from: unauthorizedAddress}));

        });

        it("should be able to update the data of a subscription", async function() {

            await contract.setSubscriptionData(subscriptionHash, "{foo: bar}", {from: subscriber});

            let subscription = await contract.subscriptions.call(subscriptionHash);
            assert.equal(subscription[5], "{foo: bar}");

        });

    });

    describe("when cancelling a subscription", () => {

        let newPlan;
        let planHash;
        let subscriptionHash;

        let futureDate = Date.now();
        futureDate = parseInt(futureDate/1000) + (60*60*24);

        before(async function() {

            newPlan = await contract.createPlan(
              business, token.address, "subscription.cancel", "test", "", 30, 100, 10, "{}", {from: business}
            );

            planHash = newPlan.logs[0].args.identifier;

            let newSubscription = await contract.createSubscription(
              planHash, "{}", {from: subscriber}
            );

            subscriptionHash = newSubscription.logs[0].args.identifier;

        });

        it("should not be able to cancel from an unauthorized address", async function() {

            await assertRevert(contract.cancelSubscription(subscriptionHash, {from: unauthorizedAddress}));

        });

        it("should be able to cancel from an authorized address", async function() {

            await contract.setTime(futureDate - 90);

            let newSubscription2 = await contract.createSubscription(
                planHash, "{}", {from: subscriber}
            );

            let subscriptionHash2 = newSubscription2.logs[0].args.identifier;

            await contract.setStartDate(futureDate, subscriptionHash2, {from: executorContract});
            await contract.cancelSubscription(subscriptionHash2, {from: executorContract});

            let subscription = await contract.subscriptions.call(subscriptionHash2);
            assert.isAbove(subscription[4].toNumber(), 0);

        });

        it("should not be able to cancel before the start date is set", async function() {

            await assertRevert(contract.cancelSubscription(subscriptionHash, {from: subscriber}));

        });

        it("should not be able to cancel before the start date is set", async function() {

            await assertRevert(contract.cancelSubscription(subscriptionHash, {from: executorContract}));

        });

        it("should be able to cancel from the owner", async function() {

            await contract.setStartDate(futureDate, subscriptionHash, {from: executorContract});
            await contract.cancelSubscription(subscriptionHash, {from: subscriber});

            let subscription = await contract.subscriptions.call(subscriptionHash);
            assert.isAbove(subscription[4].toNumber(), 0);

        });

    });

});