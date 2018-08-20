const newPlan = async function(contract, token, account, identifier, interval, cost, fee) {

    let now = parseInt(Date.now()/1000);

    await contract.setTime(now);

    let newPlan = await contract.createPlan(
        account,
        token,
        identifier,
        interval || 30,
        cost || 30,
        fee || 1,
        "{}",
        {from: account}
    );

    let planHash = newPlan.logs[0].args.identifier;

    return planHash;
};

const newSubscription = async function(contract, token, account, identifier, business, interval, cost, fee) {

    let planHash = await newPlan(contract, token, business || account, identifier, interval, cost, fee);

    let newSubscription = await contract.createSubscription(planHash, "{}", {from: account});
    let subscriptionHash = newSubscription.logs[0].args.identifier;

    return subscriptionHash;
};

const newSubscriptionFull = async function(contract, token, account, identifier, business, interval, cost, fee) {

    let planHash = await newPlan(contract, token, business || account, identifier, interval, cost, fee);

    let newSubscription = await contract.createSubscription(planHash,"{}", {from: account});
    let subscriptionHash = newSubscription.logs[0].args.identifier;

    return [planHash, subscriptionHash];
};

const newActiveSubscription = async function(executor, contract, subscriptionHash, interval, account, cycles, contractsToAdvance, processLast) {

    let now = parseInt(Date.now()/1000);
    await setTimes(contractsToAdvance, now);

    await executor.activateSubscription(contract.address, subscriptionHash, {from: account});

    let globalTime = now;
    for (var i = 1; i <= cycles; i++) {
      globalTime += (cycles * interval);
      await setTimes(contractsToAdvance, globalTime);

      if (i == cycles && processLast == true) {
        await executor.processSubscription(subscriptionHash, {from: account});
      }
    }

    return [subscriptionHash, globalTime];

};

const setTimes = async function(contracts, time) {
    contracts.forEach((contract) => {
      contract.setTime(time);
    });
};

module.exports = {
    newPlan,
    newSubscription,
    newSubscriptionFull,
    newActiveSubscription,
    setTimes
};