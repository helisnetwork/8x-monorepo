const MAXIMUM_INTERVAL_DIVISOR = 7;

function configPath() {
    return `${process.cwd()}/../artifacts/src/addresses/config.json`;
}

module.exports = {
    MAXIMUM_INTERVAL_DIVISOR,
    configPath
}