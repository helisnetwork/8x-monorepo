import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';
import { exec } from 'child_process';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var EightExToken = artifacts.require("./EightExToken.sol");

contract('VolumeSubscription', function(accounts) {

    let contract;
    let token;

    let contractOwner = accounts[0]; // Owner of the actual contract
    let executorContract = accounts[1]; // Authorized address that can create plans and subscriptions
    let business = accounts[1]; // The business who has a subscription they want to earn money from
    let subscriber = accounts[2]; // The user who is paying the business
    let unauthorizedAddress = accounts[3]; // Someone random

    before(async function() {

        contract = await MockVolumeSubscription.new({from: accounts[0]});
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

        it("should throw when creating from an unauthorised address", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "plan.new.incorrect", "test", "", 30, 100, 5, "{}", {from: unauthorizedAddress}
              )
            );

        });

        it("should throw when creating a plan with an invalid owner address", async function() {

            await assertRevert(
              contract.createPlan(
                0, token.address, "plan.new.incorrect", "test", "", 30, 100, 5, "{}", {from: executorContract}
              )
            );

        });

        it("should throw when creating a plan with an invalid token address", async function() {

            await assertRevert(
              contract.createPlan(
                business, 0, "plan.new.incorrect", "test", "", 30, 100, 5, "{}", {from: executorContract}
              )
            );

        });

        it("should throw when creating a plan with an invalid identifier", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "", "test", "", 30, 100, 5, "{}", {from: executorContract}
              )
            );

        });

        it("should throw when creating a plan with the interval set to 0", async function() {

            await assertRevert(
            contract.createPlan(
              business, token.address, "plan.new.incorrect", "test", "", 0, 100, 5, "{}", {from: executorContract}
            )
          );

        });

        it("should throw when creating a plan with the amount set to 0", async function() {

          await assertRevert(
            contract.createPlan(
              business, token.address, "plan.new.incorrect", "test", "", 30, 0, 5, "{}", {from: executorContract}
            )
          );

        });


        it("should throw when creating a plan with a fee set to 0", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "plan.new.incorrect", "test", "", 30, 100, 0, "{}", {from: executorContract}
              )
            );

        });

        it("should throw when creating a plan with a fee greater than or equal to the amount", async function() {

            await assertRevert(
              contract.createPlan(
                business, token.address, "plan.new.incorrect", "test", "", 30, 100, 100, "{}", {from: executorContract}
              )
            );

        });

        it("should be able to create a new plan correctly", async function() {

            let newPlan = await contract.createPlan(
              business, token.address, "plan.new", "test", "", 30, 100, 10, "{}", {from: executorContract}
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
                business, token.address, "plan.new", "test", "", 30, 100, 10, "{}", {from: executorContract}
              )
            );

        });

      });

});