const Event = require('../objects/event.js');

class Events {

  constructor(address, contract) {
    this.contract = contract;
    this.address = address;

    this.store = {};
  }

  startListening() {
    let parent = this;

    this.getActivationEvents().then(() => {
      return parent.getProcessedEvents();
    }).then(() => {
      return parent.getProcessedEvents();
    }).then(() => {
      return parent.getReleasedEvents();
    }).then(() => {
      console.log(`Started listening...`);
      parent.listenActivationEvents();
      parent.listenProcessedEvents();
      parent.listenReleasedEvents();
    });

  }

  getActivationEvents() {
    let parent = this;

    let i = 0;
    return this.contract.getPastEvents('SubscriptionActivated', {
      filter: {_from: this.address},
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, results){
      for (i = 0; i < results.length; i++) {
        let resultObject = results[i]
        parent.handleActivationEvent(resultObject);
      }
    });
  }

  getProcessedEvents() {
    let parent = this;
    return this.contract.getPastEvents('SubscriptionProcessed', {
      filter: {_from: this.address},
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, results) {
      let i = 0;
      for (i = 0; i < results.length; i++) {
        let resultObject = results[i];
        parent.handleProccessedEvent(resultObject);
      }
    });
  }

  getReleasedEvents() {
    let parent = this;
    return this.contract.getPastEvents('SubscriptionReleased', {
      filter: {_from: this.address},
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, results) {
      let i = 0;
      for (i = 0; i < results.length; i++) {
        let resultObject = results[i]
        parent.handleReleasedEvent(resultObject);
      }
    });
  }

  listenActivationEvents() {
    let parent = this;

    this.contract.events.SubscriptionActivated({
      fromBlock: 0
    }, function(error, resultObject) {
      parent.handleActivationEvent(resultObject);
    });
  }

  listenProcessedEvents() {
    let parent = this;
    this.contract.events.SubscriptionProcessed({
      fromBlock: 0
    }, function(error, resultObject) {
      parent.handleProccessedEvent(resultObject);
    });
  }

  listenReleasedEvents() {
    let parent = this;
    this.contract.events.SubscriptionReleased({
      fromBlock: 0
    }, function(error, resultObject) {
      parent.handleReleasedEvent(resultObject);
    });
  }

  handleActivationEvent(resultObject) {
    var eventObj = resultObject.returnValues
    var identifier = eventObj.subscriptionIdentifier;

    if (!this.isNewerTransaction(resultObject, this.store[identifier])) {
      return;
    }

    let event = {
      "subscriptionAddress": eventObj.subscriptionAddress,
      "subscriptionIdentifier": identifier,
      "tokenAddress": eventObj.tokenAddress,
      "dueDate": eventObj.dueDate,
      "amount": eventObj.amount,
      "fee": eventObj.fee,
      "blockNumber": resultObject.blockNumber,
      "transactionIndex": resultObject.transactionIndex
    };

    this.store[identifier] = event;
    console.log(`Event added:\n${JSON.stringify(this.store[identifier])}\n`);
  }

  handleProccessedEvent(resultObject) {
    var eventObj = resultObject.returnValues;
    var identifier = eventObj.subscriptionIdentifier;

    if (!this.isNewerTransaction(resultObject, this.store[identifier]) || !this.store[identifier]) {
      return;
    }

    this.store[identifier].claimant = eventObj.claimant;
    this.store[identifier].dueDate = eventObj.dueDate;
    this.store[identifier].staked = eventObj.staked;
    this.store[identifier].blockNumber = resultObject.blockNumber;
    this.store[identifier].transactionIndex = resultObject.transactionIndex;

    console.log(`Event processed:\n${JSON.stringify(this.store[identifier])}\n`);
  }

  handleReleasedEvent(resultObject) {

    var eventObj = resultObject.returnValues;
    var identifier = eventObj.subscriptionIdentifier;

    if (!this.isNewerTransaction(resultObject, this.store[identifier]) || !this.store[identifier]) {
      return;
    }

    this.store[identifier].claimant = null;
    this.store[identifier].blockNumber = resultObject.blockNumber;
    this.store[identifier].transactionIndex = resultObject.transactionIndex;

    console.log(`Event released:\n${JSON.stringify(this.store[identifier])}\n`);
  }

  isNewerTransaction(first, second) {
    if (!second || !first) {
      return true;
    }

    if (second.blockNumber > first.blockNumber) {
      return false;
    }

    if (second.blockNumber == first.blockNumber) {
      if (second.transactionIndex > first.transactionIndex) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Events;