const Repeater = require('@8xprotocol/service-node-core').default;
const AionService = require('@8xprotocol/service-node-core/dist/services/aion_service').default;

exports.start = function(nodeAddress, privateKey, addressBook, delayPeriods, topUpAmount) {
  
  if (!nodeAddress || !privateKey || !addressBook || !delayPeriods || !topUpAmount) {
    return;
  }

  let service = new AionService(privateKey, nodeAddress, addressBook, delayPeriods);
  let repeater = new Repeater(service);

  service.attemptTopUp(
      topUpAmount
  ).then(function() {
      console.log('Top up successfull');
      return repeater.start()
  }).then(function() {
      console.log("Started node");
  }).catch(function(error) {
    console.log('Failed to start node: ' + error);
  });

  repeater.repeaterUpdated = function() {
      console.log("Aion Repeater events updated");
  };
}