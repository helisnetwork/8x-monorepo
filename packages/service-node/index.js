const Web3 = require('web3');

const Repeater = require('@8xprotocol/service-node-core/').default;
const dotenv = require('dotenv')
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

const environment = dotenv.config().parsed;

let provider = new Web3.providers.HttpProvider(environment.NODE_ADDRESS);

if (environment.PRIVATE_KEY) {
  provider = new HDWalletProvider([environment.PRIVATE_KEY], environment.NODE_ADDRESS);
  console.log('Private key set');
}

const web3 = new Web3(provider);
const repeater = new Repeater(web3, environment.EXECUTOR_ADDRESS, environment.NODE_ADDRESS)
console.log(environment);

repeater.start().then(function() {
  console.log("Started!");
}).catch(function(error) {
  console.log(error);
})

repeater.repeaterUpdated = function() {
  console.log("Repeater updated");
};