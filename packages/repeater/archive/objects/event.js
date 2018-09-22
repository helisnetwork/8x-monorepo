class Event {

  constructor(
    subscriptionAddress,
    subscriptionIdentifier,
    tokenAddress,
    dueDate,
    fee,
    blockNumber,
    transactionIndex
  ) {
    this.subscriptionAddress = subscriptionAddress;
    this.subscriptionIdentifier = subscriptionIdentifier;
    this.tokenAddress = tokenAddress;
    this.dueDate = dueDate;
    this.fee = fee;
    this.claimant = null;
    this.stake = null;
    this.blockNumber = blockNumber;
    this.transactionIndex = transactionIndex;
  }

  processed(
    claimant,
    dueDate,
    stake,
    blockNumber,
    transactionIndex) {
      if (blockNumber < this.blockNumber) {
        return;
      }

      if (transactionIndex < this.transactionIndex) {
        return;
      }

      this.claimant = claimant;
      this.dueDate = dueDate;
      this.stake = stake;
  }

  released(
    blockNumber,
    transactionIndex
  ) {
    if (blockNumber < this.blockNumber) {
      return;
    }

    if (transactionIndex < this.transactionIndex) {
      return;
    }

    this.claimant = null;

  }

}

module.exports = Event;