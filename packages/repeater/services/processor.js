class Processor {

  constructor(web3, contract, address, privateKey) {
    this.web3 = web3;
    this.contract = contract;
    this.address = address;
    this.privateKey = privateKey;
  }

  processTransactions(store, info) {
    let parent = this;
    let currentDate = (Date.now() / 1000);

    var eligibleEventsArray = Object.keys(store).map((key) => {
      return this.events.store[key];
    }).filter((item) => {
      return currentDate >= item.dueDate;
    });

    this.processUnclaimed(eligibleEventsArray);
    this.processResponsibilities(eligibleEventsArray);
    this.processLatePayments(eligibleEventsArray);
  }

  processUnclaimed(eligibleEventsArray) {
    let parent = this;
    var unclaimedArray = eligibleEventsArray.filter((item) => {
      return item.claimant == null;
    }).forEach((item) => {
      const functionData = parent.contract.methods.collectPayment(item.subscriptionAddress, item.subscriptionIdentifier);
      signTransaction(web3, parent.contract, parent.address, parent.privateKey, functionData).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    });

    if (unclaimedArray) {
      console.log("Processing unclaimed " + unclaimedArray);
    }

  }

  processResponsibilities(eligibleEventsArray) {
    let parent = this;
    var serviceArray = eligibleEventsArray.filter((item) => {
      return item.claimant == serviceNodeAccount.address;
    }).forEach((item) => {
      const functionData = parent.contract.methods.collectPayment(item.subscriptionAddress, item.subscriptionIdentifier);
      signTransaction(web3, parent.contract, parent.address, parent.privateKey, functionData).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    });

    if (serviceArray) {
      console.log("Processing responsibilities " + serviceArray);
    }
  }

  processLatePayments(eligibleEventsArray) {
    var stealArray = eligibleEventsArray.filter((item) => {
      return item.claimant != serviceNodeAccount.address && item.claimant != 0;
    }).forEach((item) => {
      const functionData = parent.contract.methods.catchLatePayment(item.subscriptionAddress, item.subscriptionIdentifier);
      signTransaction(web3, parent.contract, parent.address, parent.privateKey, functionData).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    });

    if (stealArray) {
      console.log("Processing late payments " + stealArray);
    }
  }

}

module.exports = Processor;