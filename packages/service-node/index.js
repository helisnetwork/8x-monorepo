let Web3 = require('web3');
let Repeater = require('@8xprotocol/service-node-core');

let dotenv = require('dotenv')
let HDWalletProvider = require('truffle-hdwallet-provider');

const environment = dotenv.config();

let provider = new Web3.providers.HttpProvider(environment.NODE_ADDRESS);

if (environment.PRIVATE_KEY) {
  provider = new HDWalletProvider(environment.PRIVATE_KEY, environment.NODE_ADDRESS);
}

const web3 = new Web3(provider);
const repeater = new Repeater(web3, environment.EXECUTOR_ADDRESS, environment.NODE_ADDRESS)

repeater.start();