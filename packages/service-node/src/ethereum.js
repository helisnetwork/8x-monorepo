const Web3 = require('web3');

const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");

const EthereumService = require('@8xprotocol/service-node-core/dist/services/ethereum_service').default;
const Repeater = require('@8xprotocol/service-node-core').default;

exports.start = function(nodeAddress, privateKey, addressBook, delayPeriods, topUpAmount) {

  if (!nodeAddress || !privateKey || !addressBook || !delayPeriods || !topUpAmount) {
    return;
  }

  let provider = new Web3.providers.HttpProvider(nodeAddress);

  if (privateKey) {
      provider = new HDWalletProvider([privateKey.toLowerCase()], nodeAddress);
      console.log('Private key set sucessfully');
  }

  let nonceTracker = new NonceTrackerSubprovider()
  provider.engine._providers.unshift(nonceTracker)
  nonceTracker.setEngine(provider.engine);
  
  let service = new EthereumService(provider, Object.keys(provider.wallets)[0], addressBook, delayPeriods);
  repeater = new Repeater(service);

  service.attemptTopUp(
      topUpAmount
  ).then(function() {
      console.log('Top up successfull');
      return repeater.start()
  }).then(function() {
      console.log("Started node");
  }).catch(function(error) {
      console.log('Failed to start node: ' + error);
  })

  repeater.repeaterUpdated = function() {
      console.log("Ethereum Repeater events updated");
  };
}