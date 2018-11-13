const MAXIMUM_INTERVAL_DIVISOR = 5;

function configPath() {
    return `${process.cwd()}/../artifacts/src/addresses/config.json`;
}

function isActualDeployment(network) {
    if (network !== 'ropsten' && network !== 'kovan' && network !== 'rinkeby' && network !== 'main') {
        return false;
    }

    return true;
}

module.exports = {
    MAXIMUM_INTERVAL_DIVISOR,
    isActualDeployment,
    configPath
}