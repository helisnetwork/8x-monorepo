import { ConfigAddresses } from "@8xprotocol/artifacts";

const config = ConfigAddresses.kovan;

function getToken(ticker) {
  let object = config['approvedTokens'].find((item) => item.ticker == ticker) || { address: '' }
  return object.address;
}

function getContract(contract) {
  let object = config['addresses'].find((item) => item.name == contract) || { address: '' }
  return object.address;
}

export { getContract, getToken }