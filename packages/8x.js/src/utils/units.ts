import { BigNumber } from 'bignumber.js';

const ether = (decimalAmount: number): BigNumber => {
    const decimalBigNumber = new BigNumber(decimalAmount);
    const weiInEther = new BigNumber(10 ** 18);

    return decimalBigNumber.times(weiInEther);
}

const gwei = (decimalAmount: number): BigNumber => {
    return new BigNumber(decimalAmount * (10 ** 9));
}

const cents = (decimalAmount: number): BigNumber => {
  return new BigNumber(decimalAmount * (10 ** 16));
}

const dollars = (decimalAmount: number): BigNumber => {
  return new BigNumber(decimalAmount * (10 ** 18));
}

export { ether, gwei, cents, dollars };
