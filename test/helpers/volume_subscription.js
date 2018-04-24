const newPlan = async function(contract, account, identifier = Math.random().toString(36)) {

    let newPlan = await contract.createPlan(account, identifier, "Test", "Description", 30, 10, "{}", {from: account});
    let planHash = newPlan.logs[0].args.identifier;

    return planHash;
}

const newSubscription = async function(contract, account) {

    let now = Date.now();
    now = now/1000;

    let planHash = await newPlan(contract, account);

    let newSubscription = await contract.createSubscription(account, planHash, now, "{}", {from: account});
    let subscriptionHash = newSubscription.logs[0].args.identifier;

    return subscriptionHash;
}

const newSubscriptionFull = async function(contract, account) {

    let now = Date.now();
    now = now/1000;

    let planHash = await newPlan(contract, account);

    let newSubscription = await contract.createSubscription(account, planHash, now, "{}", {from: account});
    let subscriptionHash = newSubscription.logs[0].args.identifier;

    return [planHash, subscriptionHash];
}

module.exports = {
    newPlan,
    newSubscription,
    newSubscriptionFull
};