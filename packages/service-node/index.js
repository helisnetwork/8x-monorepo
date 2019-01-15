const BigNumber = require('bignumber.js');
const Artifacts = require('@8xprotocol/artifacts');

const Ethereum = require('./src/ethereum');
const Aion = require('./src/aion');
const topUpAmount = new BigNumber(100).mul(10 ** 18);

require('dotenv').config();
const environment = require('dotenv').config({ path: `./secrets/${process.env.ENV_NAME}`}).parsed;

function getAllTokens(network) {
  if (!network) {
    return;
  }

  return Artifacts.ConfigAddresses[network]['approvedTokens'].map((item) => item.address) || { address: '' };
}

function getContract(contract, network) {
  if (!network) {
      return;
  }

  let object = Artifacts.ConfigAddresses[network]['addresses'].find((item) => item.name == contract) || { address: '' };
  return object.address;
}

function getDelayPeriod() {
  return {
      processing: 0,
      catchLate: 5,
      stopChecking: 10
  }
}

function generateAddressBook(network) {
  return {
    volumeSubscriptionAddress: getContract("VolumeSubscription", network),
    transactingTokenAddresses: getAllTokens(network),
    executorAddress: getContract("Executor", network),
    transferProxyAddress: getContract("TransferProxy", network),
    payrollSubscriptionAddress: getContract("PayrollSubscription", network),
    stakeContractAddress: getContract("StakeContract", network),
    stakeTokenAddress: getContract("EightExToken", network)
  }
}

console.log(environment.BLOCKCHAIN.toUpperCase() + ' node started...');

if (environment.BLOCKCHAIN == 'ethereum') {
  Ethereum.start(
    environment.NODE_ADDRESS,
    environment.PRIVATE_KEY,
    generateAddressBook(environment.NETWORK),
    getDelayPeriod(),
    topUpAmount
  );
}

if (environment.BLOCKCHAIN == 'aion') {
  Aion.start(
    environment.NODE_ADDRESS,
    environment.PRIVATE_KEY,
    generateAddressBook(environment.NETWORK),
    getDelayPeriod(),
    topUpAmount
  );
}