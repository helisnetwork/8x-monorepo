var Plans = artifacts.require("./Plans.sol");
var Subscription = artifacts.require("./Subscription.sol");

contract('Subscription', function(accounts) {

    /*let subscription;
    let plan;

    let initialStart = Date.now();
    initialStart = parseInt(initialStart/1000);

    beforeEach(async function() {
        plan = await Plan.new(accounts[1], "Test", 30, 10);
        subscription = await Subscription.new(accounts[0], initialStart, plan.address);
    });

    it("should be able to intialise correctly", async function() {
        let owner = await subscription.owner.call();
        let startDate = await subscription.startDate.call();
        let planContract = await subscription.PLAN_CONTRACT.call();
        let interval = await subscription.interval.call();
        let amount = await subscription.amount.call();

        assert.equal(owner, accounts[0]);
        assert.equal(startDate, initialStart);
        assert.equal(planContract, plan.address);
        assert.equal(interval, 30);
        assert.equal(amount, 10);
    });*/

});