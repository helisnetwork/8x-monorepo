import {
  TypedMap,
  Entity,
  Value,
  Address,
  Bytes,
  BigInt
} from "@graphprotocol/graph-ts";

export class SubscriptionActivated extends Entity {
  get id(): string {
    let value = this.get("id");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set id(value: string) {
    if (value === null) {
      this.unset("id");
    } else {
      this.set("id", Value.fromString(value as string));
    }
  }

  get subscriptionAddress(): string {
    let value = this.get("subscriptionAddress");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set subscriptionAddress(value: string) {
    if (value === null) {
      this.unset("subscriptionAddress");
    } else {
      this.set("subscriptionAddress", Value.fromString(value as string));
    }
  }

  get tokenAddress(): string {
    let value = this.get("tokenAddress");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set tokenAddress(value: string) {
    if (value === null) {
      this.unset("tokenAddress");
    } else {
      this.set("tokenAddress", Value.fromString(value as string));
    }
  }

  get dueDate(): BigInt {
    let value = this.get("dueDate");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt;
    }
  }

  set dueDate(value: BigInt) {
    if (value === null) {
      this.unset("dueDate");
    } else {
      this.set("dueDate", Value.fromBigInt(value as BigInt));
    }
  }

  get amount(): BigInt {
    let value = this.get("amount");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt;
    }
  }

  set amount(value: BigInt) {
    if (value === null) {
      this.unset("amount");
    } else {
      this.set("amount", Value.fromBigInt(value as BigInt));
    }
  }

  get fee(): BigInt {
    let value = this.get("fee");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt;
    }
  }

  set fee(value: BigInt) {
    if (value === null) {
      this.unset("fee");
    } else {
      this.set("fee", Value.fromBigInt(value as BigInt));
    }
  }
}

export class SubscriptionProcessed extends Entity {
  get id(): string {
    let value = this.get("id");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set id(value: string) {
    if (value === null) {
      this.unset("id");
    } else {
      this.set("id", Value.fromString(value as string));
    }
  }

  get claimant(): string {
    let value = this.get("claimant");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set claimant(value: string) {
    if (value === null) {
      this.unset("claimant");
    } else {
      this.set("claimant", Value.fromString(value as string));
    }
  }

  get dueDate(): BigInt {
    let value = this.get("dueDate");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt;
    }
  }

  set dueDate(value: BigInt) {
    if (value === null) {
      this.unset("dueDate");
    } else {
      this.set("dueDate", Value.fromBigInt(value as BigInt));
    }
  }

  get staked(): BigInt | null {
    let value = this.get("staked");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set staked(value: BigInt | null) {
    if (value === null) {
      this.unset("staked");
    } else {
      this.set("staked", Value.fromBigInt(value as BigInt));
    }
  }
}

export class SubscriptionCancelled extends Entity {
  get id(): string {
    let value = this.get("id");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set id(value: string) {
    if (value === null) {
      this.unset("id");
    } else {
      this.set("id", Value.fromString(value as string));
    }
  }

  get subscriptionAddress(): string {
    let value = this.get("subscriptionAddress");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set subscriptionAddress(value: string) {
    if (value === null) {
      this.unset("subscriptionAddress");
    } else {
      this.set("subscriptionAddress", Value.fromString(value as string));
    }
  }
}
