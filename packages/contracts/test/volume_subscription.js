const web3 = require('web3');
const keccak = require('./helpers/keccak');
const assertRevert = require('./helpers/assert_revert');

var MockVolumeSubscription = artifacts.require("./test/MockVolumeSubscription.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var MockKyberNetwork = artifacts.require("./test/MockKyberNetwork.sol");

contract('VolumeSubscription', function(accounts) {

    let contract;
    let token;

    let contractOwner = accounts[0]; // Owner of the actual contract
    let executorContract = accounts[1]; // Authorized address that can create plans and subscriptions
    let business = accounts[2]; // The business who has a subscription they want to earn money from
    let subscriber = accounts[3]; // The user who is paying the business
    let unauthorizedAddress = accounts[4]; // Someone random
    let approvedRegistryContract;
    let kyberNetwork;

    before(async function() {

        kyberNetwork = await MockKyberNetwork.new({ from: contractOwner });
        approvedRegistryContract = await ApprovedRegistry.new(kyberNetwork.address, { from: contractOwner });

        contract = await MockVolumeSubscription.new(approvedRegistryContract.address, { from: accounts[0] });
        token = await EightExToken.new({ from: accounts[0] });

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

        it('should not be able to update the gas price as an unauthorised address', async function() {

            await assertRevert(contract.setGasPrice(5, { from: unauthorizedAddress }));

        });

        it('should be able to update the gas price as an authorised address', async function() {

            await contract.setGasPrice(1 * 10 ** 9, { from: contractOwner });
            let details = await contract.getGasForExecution.call('', 0);
            assert.equal(details[1], 1 * 10 ** 9);

        });

        it('should not be able to update the gas cost as an unauthorised address', async function() {

            await assertRevert(contract.setGasCost(5, { from: unauthorizedAddress }));

        });

        it('should be able to update the gas price as an authorised address', async function() {

            await contract.setGasCost(100000, { from: contractOwner });
            let details = await contract.getGasForExecution.call('', 0);
            assert.equal(details[0], 100000);

        });

    });

    describe("when creating a new plan", () => {

        it("should throw when creating a plan with an invalid owner address", async function() {

            await assertRevert(
                contract.createPlan(
                    0, token.address, web3.utils.fromAscii("plan.new.incorrect"), 30, 100, 5, 0, { from: business }
                )
            );

        });

        it("should throw when creating a plan with an invalid identifier", async function() {

            await assertRevert(
                contract.createPlan(
                    business, token.address, "", 30, 100, 5, 0, { from: business }
                )
            );

        });

        it("should throw when creating a plan with no token address", async function() {

            await assertRevert(
                contract.createPlan(
                    business, 0, web3.utils.fromAscii("plan.new.no_token"), 30, 100, 10, 0, { from: business }
                )
            );

        });

        it("should throw when creating a plan with an unauthorised token", async function() {

            await assertRevert(
                contract.createPlan(
                    business, token.address, web3.utils.fromAscii("plan.new"), 30, 100, 10, 0, { from: business }
                )
            );

        });

        it("should throw when creating a plan with the interval set to 0", async function() {

            await assertRevert(
                contract.createPlan(
                    business, token.address, web3.utils.fromAscii("plan.new.incorrect"), 0, 100, 5, 0, { from: business }
                )
            );

        });

        it("should throw when creating a plan with the amount set to 0", async function() {

            await assertRevert(
                contract.createPlan(
                    business, token.address, web3.utils.fromAscii("plan.new.incorrect"), 30, 0, 5, 0, { from: business }
                )
            );

        });


        it("should throw when creating a plan with a fee set to 0", async function() {

            await assertRevert(
                contract.createPlan(
                    business, token.address, web3.utils.fromAscii("plan.new.incorrect"), 30, 100, 0, 0, { from: business }
                )
            );

        });

        it("should throw when creating a plan with a fee greater than or equal to the amount", async function() {

            await assertRevert(
                contract.createPlan(
                    business, token.address, web3.utils.fromAscii("plan.new.incorrect"), 30, 100, 100, 0, { from: business }
                )
            );

        });

        it("should be able to create a new plan correctly", async function() {

            await approvedRegistryContract.addApprovedToken(token.address, false, { from: contractOwner });


            let newPlan = await contract.createPlan(
                business, token.address, web3.utils.fromAscii("plan.new"), 30, 100, 10, 0, { from: business }
            );

            let planHash = newPlan.logs[0].args.planIdentifier;
            let plan = await contract.plans.call(planHash);

            assert.equal(plan[0], business);
            assert.equal(plan[1], token.address);
            assert.equal(web3.utils.toUtf8(plan[2]), "plan.new");
            assert.equal(plan[3], 30);
            assert.equal(plan[4], 100);
            assert.equal(plan[5], 10);
            assert.equal(plan[6], 0);

            let computedHash = keccak(
                ["address", "address", "bytes32", "uint256", "uint256", "uint256", "string"], [business, token.address, web3.utils.fromAscii("plan.new"), 30, 100, 10, ""]
            );

            assert.equal(computedHash, planHash);

        });

        it("should be able to create a new plan with duplicate details", async function() {

            await assertRevert(
                contract.createPlan(
                    business, token.address, web3.utils.fromAscii("plan.new"), 30, 100, 10, "", { from: business }
                )
            );

        });

    });

    describe("when updating a plan", () => {

        let newPlan;
        let planHash;

        before(async function() {

            newPlan = await contract.createPlan(
                business, token.address, web3.utils.fromAscii("plan.update"), 30, 100, 10, "", { from: business }
            );

            planHash = newPlan.logs[0].args.planIdentifier;

        });

        it("should throw when setting the owner from an unauthorized address", async function() {

            await assertRevert(contract.setPlanOwner(planHash, accounts[5], { from: unauthorizedAddress }));

        });

        it("should be able to update the owner", async function() {

            await contract.setPlanOwner(planHash, accounts[5], { from: business });

            let returnedPlan = await contract.plans.call(planHash);
            assert(returnedPlan[0], accounts[5]);

            await contract.setPlanOwner(planHash, business, { from: accounts[5] });

        });

        it("should throw when setting the data from an unauthorized address", async function() {

            await assertRevert(contract.setPlanData(planHash, "{foo: bar}", { from: unauthorizedAddress }));

        });

        it("should be able to update the data", async function() {

            await contract.setPlanData(planHash, "{foo: bar}", { from: business });

            let returnedPlan = await contract.plans.call(planHash);
            assert(returnedPlan[6], "{foo: bar}");

        });

    });

    describe("when terminating a plan", () => {

        let newPlan;
        let planHash;

        before(async function() {

            newPlan = await contract.createPlan(
                business, token.address, web3.utils.fromAscii("plan.terminate"), 30, 100, 10, 0, { from: business }
            );

            planHash = newPlan.logs[0].args.planIdentifier;

        });

        it("should throw when terminating a plan from an unauthorized address", async function() {

            let terminationDate = Date.now();
            terminationDate = parseInt(terminationDate / 1000) + (60 * 60 * 24);
            await assertRevert(contract.terminatePlan(planHash, terminationDate, { from: unauthorizedAddress }));

        });

        it("should throw when terminating a plan with the termination date in the past", async function() {

            let terminationDate = Date.now();
            terminationDate = parseInt(terminationDate / 1000) - (60 * 60 * 24);
            await assertRevert(contract.terminatePlan(planHash, terminationDate, { from: business }));

        });

        it("should be able to terminate a plan", async function() {

            let terminationDate = Date.now();
            terminationDate = parseInt(terminationDate / 1000) + (60 * 60 * 24);
            await contract.terminatePlan(planHash, terminationDate, { from: business });

            let plan = await contract.plans.call(planHash);
            assert.equal(plan[7], terminationDate);

        });

    });

    describe("when creating a new subscription", () => {

        let newPlan;
        let planHash;
        let subscriptionHash;

        let now = parseInt(Date.now() / 1000);
        let futureDate = now + (60 * 60 * 24);

        before(async function() {

            newPlan = await contract.createPlan(
                business, token.address, web3.utils.fromAscii("subscription.new"), 30, 100, 10, 0, { from: business }
            );

            planHash = newPlan.logs[0].args.planIdentifier;

        });

        it("should not be able to create with an invalid plan hash", async function() {

            let incorrectHash = keccak(
                ["string"], ["test"]
            );

            await assertRevert(contract.createSubscription(incorrectHash, "{}", { from: subscriber }));

        });

        it("should be able to create a subscription from an authorized address", async function() {

            await contract.setTime(now);

            let newSubscription = await contract.createSubscription(
                planHash, "", { from: subscriber }
            );

            subscriptionHash = newSubscription.logs[0].args.paymentIdentifier;
            let subscription = await contract.subscriptions.call(subscriptionHash);

            assert.equal(subscription[0], subscriber);
            assert.equal(subscription[1], token.address);
            assert.equal(subscription[2], planHash);
            assert.equal(subscription[3], 0);
            assert.equal(subscription[4], 0);
            assert.equal(subscription[5], 0);

            let computedHash = keccak(
                ["address", "bytes32", "uint256"], [subscriber, planHash, now]
            );

            assert.equal(computedHash, subscriptionHash);

            let status = await contract.getPaymentStatus(subscriptionHash);
            assert.equal(status, 0);

        });

        it("should be able to create a subscription from an authorized address and a supplied salt", async function() {

            await contract.setTime(now);

            let newSubscription = await contract.createSubscriptionWithSalt(
                planHash, "", 5, { from: subscriber }
            );

            subscriptionHash = newSubscription.logs[0].args.paymentIdentifier;
            let subscription = await contract.subscriptions.call(subscriptionHash);

            assert.equal(subscription[0], subscriber);
            assert.equal(subscription[1], token.address);
            assert.equal(subscription[2], planHash);
            assert.equal(subscription[3], 0);
            assert.equal(subscription[4], 0);
            assert.equal(subscription[5], 0);

            let computedHash = keccak(
                ["address", "bytes32", "uint256"], [subscriber, planHash, 5]
            );

            assert.equal(computedHash, subscriptionHash);

        });

        it("should throw when trying to resubscribe with an existing active subscription", async function() {

            await assertRevert(contract.createSubscription(
                planHash, 0, { from: subscriber }
            ));

        });

        it("should not be able to set the last payment date as the subscriber", async function() {

            await assertRevert(contract.setLastestPaymentDate(futureDate, subscriptionHash, { from: subscriber }));

        });

        it("should not be able to set the last payment date as the business", async function() {

            await assertRevert(contract.setLastestPaymentDate(futureDate, subscriptionHash, { from: business }));

        });

        it("should be able to set the last payment date from the executor", async function() {

            await contract.setLastestPaymentDate(futureDate, subscriptionHash, { from: executorContract });

            let subscription = await contract.subscriptions.call(subscriptionHash)
            assert.equal(subscription[3].toNumber(), futureDate);

        });

        it("should be able to update the last payment date to a date in the future", async function() {

            await contract.setLastestPaymentDate(futureDate + 100, subscriptionHash, { from: executorContract });
            let subscription = await contract.subscriptions.call(subscriptionHash)
            assert.equal(subscription[3].toNumber(), futureDate + 100);

        });

    });

    describe("when updating a subscription", () => {

        let newPlan;
        let planHash;
        let subscriptionHash;

        let futureDate = Date.now();
        futureDate = parseInt(futureDate / 1000) + (60 * 60 * 24);

        before(async function() {

            newPlan = await contract.createPlan(
                business, token.address, web3.utils.fromAscii("subscription.update"), 30, 100, 10, "", { from: business }
            );

            planHash = newPlan.logs[0].args.planIdentifier;

            let newSubscription = await contract.createSubscription(
                planHash, 0, { from: subscriber }
            );

            subscriptionHash = newSubscription.logs[0].args.paymentIdentifier;

        });

        it("should throw when upadating the data from an unauthorized address", async function() {

            await assertRevert(contract.setSubscriptionData(subscriptionHash, "{foo: bar}", { from: unauthorizedAddress }));

        });

        it("should be able to update the data of a subscription", async function() {

            await contract.setSubscriptionData(subscriptionHash, "{foo: bar}", { from: subscriber });

            let subscription = await contract.subscriptions.call(subscriptionHash);
            assert.equal(subscription[5], "{foo: bar}");

        });

    });

    describe("when cancelling a subscription", () => {

        let newPlan;
        let planHash;
        let subscriptionHash;

        let futureDate = Date.now();
        futureDate = parseInt(futureDate / 1000) + (60 * 60 * 24);

        before(async function() {

            newPlan = await contract.createPlan(
                business, token.address, web3.utils.fromAscii("subscription.cancel"), 30, 100, 10, "", { from: business }
            );

            planHash = newPlan.logs[0].args.planIdentifier;

            let newSubscription = await contract.createSubscription(
                planHash, 0, { from: subscriber }
            );

            subscriptionHash = newSubscription.logs[0].args.paymentIdentifier;

        });

        it("should not be able to cancel from an unauthorized address", async function() {

            await assertRevert(contract.cancelPayment(subscriptionHash, { from: unauthorizedAddress }));

        });

        it("should be able to cancel from an authorized address", async function() {

            await contract.setTime(futureDate - 90);

            let newSubscription2 = await contract.createSubscription(
                planHash, "", { from: subscriber }
            );

            let subscriptionHash2 = newSubscription2.logs[0].args.paymentIdentifier;

            await contract.setLastestPaymentDate(futureDate, subscriptionHash2, { from: executorContract });

            let status = await contract.getPaymentStatus(subscriptionHash2);
            assert.equal(status, 1);

            await contract.cancelPayment(subscriptionHash2, { from: executorContract });

            let subscription = await contract.subscriptions.call(subscriptionHash2);
            assert.isAbove(subscription[4].toNumber(), 0);

            let status2 = await contract.getPaymentStatus(subscriptionHash2);
            assert.equal(status2, 2);

        });

        it("should not be able to cancel before the start date is set", async function() {

            await assertRevert(contract.cancelPayment(subscriptionHash, { from: subscriber }));

        });

        it("should not be able to cancel before the start date is set", async function() {

            await assertRevert(contract.cancelPayment(subscriptionHash, { from: executorContract }));

        });

        it("should be able to cancel from the owner", async function() {

            await contract.setLastestPaymentDate(futureDate, subscriptionHash, { from: executorContract });
            await contract.cancelPayment(subscriptionHash, { from: subscriber });

            let subscription = await contract.subscriptions.call(subscriptionHash);
            assert.isAbove(subscription[4].toNumber(), 0);

        });

        it("should not be able cancel without throwing", async function() {

            await contract.cancelPayment(subscriptionHash, { from: subscriber });

            let subscription = await contract.subscriptions.call(subscriptionHash)
            assert.isAbove(subscription[4].toNumber(), 0);

        });


    });

});