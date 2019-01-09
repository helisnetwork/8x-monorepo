const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")

require('babel-register');
require('babel-polyfill');

require('dotenv').config();

module.exports = {
    networks: {
        develop: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 6700000
        },
        ropsten: {
            provider: () => new HDWalletProvider([process.env.ETHEREUM_PRIVATE_KEY], "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 3,
            gas: 6700000,
            gasPrice: 5
        },
        kovan: {
            provider: () => {
                let wallet = new HDWalletProvider([process.env.ETHEREUM_PRIVATE_KEY], "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY);
                let nonceTracker = new NonceTrackerSubprovider()
                wallet.engine._providers.unshift(nonceTracker)
                nonceTracker.setEngine(wallet.engine)
                return wallet
            },
            network_id: 42,
            gas: 6700000,
            gasPrice: 5
        },
        rinkeby: {
            provider: () => new HDWalletProvider([process.env.ETHEREUM_PRIVATE_KEY], "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 4,
            gas: 6700000,
            gasPrice: 5
        },
        main: {
            provider: () => new HDWalletProvider([process.env.ETHEREUM_PRIVATE_KEY], "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 1,
            gas: 6700000,
            gasPrice: 5
        }
    },
    compilers: {
        solc: {
            version:"0.4.24"       // Version. ex:  "0.4.20". (Default: truffle's installed solc)
        }
    }
};