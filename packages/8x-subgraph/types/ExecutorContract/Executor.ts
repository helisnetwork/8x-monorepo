import {
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class SubscriptionActivated extends EthereumEvent {
  get params(): SubscriptionActivatedParams {
    return new SubscriptionActivatedParams(this);
  }
}

export class SubscriptionActivatedParams {
  _event: SubscriptionActivated;

  constructor(event: SubscriptionActivated) {
    this._event = event;
  }

  get subscriptionAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get subscriptionIdentifier(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get tokenAddress(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get dueDate(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get fee(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class SubscriptionProcessed extends EthereumEvent {
  get params(): SubscriptionProcessedParams {
    return new SubscriptionProcessedParams(this);
  }
}

export class SubscriptionProcessedParams {
  _event: SubscriptionProcessed;

  constructor(event: SubscriptionProcessed) {
    this._event = event;
  }

  get subscriptionIdentifier(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get claimant(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get dueDate(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get staked(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class SubscriptionReleased extends EthereumEvent {
  get params(): SubscriptionReleasedParams {
    return new SubscriptionReleasedParams(this);
  }
}

export class SubscriptionReleasedParams {
  _event: SubscriptionReleased;

  constructor(event: SubscriptionReleased) {
    this._event = event;
  }

  get subscriptionIdentifier(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get releasedBy(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get dueDate(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class SubscriptionLatePaymentCaught extends EthereumEvent {
  get params(): SubscriptionLatePaymentCaughtParams {
    return new SubscriptionLatePaymentCaughtParams(this);
  }
}

export class SubscriptionLatePaymentCaughtParams {
  _event: SubscriptionLatePaymentCaught;

  constructor(event: SubscriptionLatePaymentCaught) {
    this._event = event;
  }

  get subscriptionIdentifier(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get originalClaimant(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newClaimant(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get amountLost(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class SubscriptionCancelled extends EthereumEvent {
  get params(): SubscriptionCancelledParams {
    return new SubscriptionCancelledParams(this);
  }
}

export class SubscriptionCancelledParams {
  _event: SubscriptionCancelled;

  constructor(event: SubscriptionCancelled) {
    this._event = event;
  }

  get subscriptionAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get subscriptionIdentifier(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class Checkpoint extends EthereumEvent {
  get params(): CheckpointParams {
    return new CheckpointParams(this);
  }
}

export class CheckpointParams {
  _event: Checkpoint;

  constructor(event: Checkpoint) {
    this._event = event;
  }

  get number(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class OwnershipTransferred extends EthereumEvent {
  get params(): OwnershipTransferredParams {
    return new OwnershipTransferredParams(this);
  }
}

export class OwnershipTransferredParams {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Executor extends SmartContract {
  static bind(address: Address): Executor {
    return new Executor("Executor", address);
  }

  stakeContract(): Address {
    let result = super.call("stakeContract", []);
    return result[0].toAddress();
  }

  approvedRegistry(): Address {
    let result = super.call("approvedRegistry", []);
    return result[0].toAddress();
  }

  transferProxy(): Address {
    let result = super.call("transferProxy", []);
    return result[0].toAddress();
  }

  owner(): Address {
    let result = super.call("owner", []);
    return result[0].toAddress();
  }

  paymentRegistry(): Address {
    let result = super.call("paymentRegistry", []);
    return result[0].toAddress();
  }

  maximumIntervalDivisor(): BigInt {
    let result = super.call("maximumIntervalDivisor", []);
    return result[0].toBigInt();
  }
}
