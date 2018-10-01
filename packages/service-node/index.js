/*

------------------------------------------------------------

Create a .env file and fill in the following variables below

------------------------------------------------------------

# HTTP Address of Ethereum node to connect to
NODE_ADDRESS = ""

# Public key of the node executing
PUBLIC_KEY = ""

# Private key of the node executing
PRIVATE_KEY = ""

# Executor contract address
EXECUTOR = ""

# Transcting token address (that you'd like to stake for)
TRANSACTING_TOKEN = ""

# Token being staked (native 8x token)
STAKE_TOKEN = ""

# Stake contract address
STAKE_CONTRACT = ""

*/

const Web3 = require('web3');

const Repeater = require('@8xprotocol/service-node-core').default;
const dotenv = require('dotenv')
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const BigNumber = require('bignumber.js');

const environment = dotenv.config().parsed;

let provider = new Web3.providers.HttpProvider(environment.NODE_ADDRESS);

if (environment.PRIVATE_KEY) {
  provider = new HDWalletProvider([environment.PRIVATE_KEY], environment.NODE_ADDRESS);
  console.log('Private key set sucessfully');
}

const web3 = new Web3(provider);
const repeater = new Repeater(web3, environment.EXECUTOR, environment.PUBLIC_KEY)

const topUpAmount = new BigNumber(100).mul(10**18);

repeater.attemptTopUp(
  topUpAmount,
  environment.TRANSACTING_TOKEN,
  environment.STAKE_TOKEN,
  environment.STAKE_CONTRACT)
.then(function() {
  console.log('Top up successfull');
  return repeater.start()
}).then(function() {
  console.log("Started node");
}).catch(function(error) {
  console.log(error);
})

repeater.repeaterUpdated = function() {
  console.log("Repeater events updated");
};