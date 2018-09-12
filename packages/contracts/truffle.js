const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config();

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 4700000
        },
        ropsten: {
            provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
            network_id: 3,
            gas: 4700000,
            gasPrice: 21
        },
        kovan: {
          provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY),
          network_id: 42,
          gas: 4700000,
          gasPrice: 21
        },
        rinkeby: {
          provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
          network_id: 4,
          gas: 4700000,
          gasPrice: 21
        },
        main: {
          provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY),
          network_id: 1,
          gas: 4700000,
          gasPrice: 21
        }
    }
};
