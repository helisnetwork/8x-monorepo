require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 7546,
            network_id: "*" // Match any network id
        },
    }
};
