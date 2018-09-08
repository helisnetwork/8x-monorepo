require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
        testing: {
            host: "localhost",
            port: 8545,
            network_id: "*",
            gas: 4700000
        },
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 4700000
        }
    }
};
