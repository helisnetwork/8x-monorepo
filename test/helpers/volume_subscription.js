const newPlan = async function(contract, token, account, identifier) {

    let now = Date.now();
    now = parseInt(now/1000);

    await contract.setTime(now);

    let newPlan = await contract.createPlan(account, token, identifier, "Test", "Description", 30, 10, 1, "{}", {from: account});
    let planHash = newPlan.logs[0].args.identifier;

    return planHash;
}

const newSubscription = async function(contract, token, account, identifier) {

    let planHash = await newPlan(contract, token, account, identifier);

    let newSubscription = await contract.createSubscription(planHash, "{}", {from: account});
    let subscriptionHash = newSubscription.logs[0].args.identifier;

    return subscriptionHash;
}

const newSubscriptionFull = async function(contract, token, account, identifier) {

    let planHash = await newPlan(contract, token, account, identifier);

    let newSubscription = await contract.createSubscription(planHash,"{}", {from: account});
    let subscriptionHash = newSubscription.logs[0].args.identifier;

    return [planHash, subscriptionHash];
}

module.exports = {
    newPlan,
    newSubscription,
    newSubscriptionFull
};