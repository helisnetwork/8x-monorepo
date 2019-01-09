const web3 = require('web3');

const newPlan = async function(contract, token, account, identifier, interval, cost, fee) {

    let now = parseInt(Date.now() / 1000);

    await contract.setTime(now);

    let newPlan = await contract.createPlan(
        account,
        token,
        web3.utils.fromAscii(identifier),
        interval || 30,
        cost || 30,
        fee || 1,
        0,
        { from: account }
    );

    let planHash = newPlan.logs[0].args.planIdentifier;

    return planHash;
};

const newSubscription = async function(contract, token, account, identifier, business, interval, cost, fee) {

    let planHash = await newPlan(contract, token, business || account, identifier, interval, cost, fee);

    let newSubscription = await contract.createSubscription(planHash, 0, { from: account });
    let subscriptionHash = newSubscription.logs[0].args.paymentIdentifier;

    return subscriptionHash;
};

const newSubscriptionFull = async function(contract, token, account, identifier, business, interval, cost, fee) {

    let planHash = await newPlan(contract, token, business || account, identifier, interval, cost, fee);

    let newSubscription = await contract.createSubscription(planHash, 0, { from: account });
    let subscriptionHash = newSubscription.logs[0].args.paymentIdentifier;

    return [planHash, subscriptionHash];
};

const newActiveSubscription = async function(executor, contract, account, subscriptionHash, interval, serviceNode, cycles, contractsToAdvance, processLast) {

    let now = parseInt(Date.now() / 1000);
    await setTimes(contractsToAdvance, now);

    await executor.activateSubscription(contract.address, subscriptionHash, { from: account });

    let globalTime = now;
    for (var i = 1; i <= cycles; i++) {
        globalTime = now + (i * interval);

        await setTimes(contractsToAdvance, globalTime);

        if (i == cycles && processLast == false) {
            break;
        }

        await executor.processSubscription(contract.address, subscriptionHash, { from: serviceNode });
    }

    return [subscriptionHash, globalTime];

};

const setTimes = async function(contracts, time) {
    for (const contract of contracts) {
        await contract.setTime(time);
    };
};

module.exports = {
    newPlan,
    newSubscription,
    newSubscriptionFull,
    newActiveSubscription,
    setTimes
};