/*

------------------------------------------------------------

Create a .env file and fill in the following variables below

------------------------------------------------------------

# HTTP Address of Ethereum node to connect to
NODE_ADDRESS = ""

# Public key of the node executing
PUBLIC_KEY = ""

# Private key of the node executing
PRIVATE_KEY = ""

# Network to execute on (kovan, main etc)
NETWORK = ""

*/

const Web3 = require('web3');
const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")

const Repeater = require('@8xprotocol/service-node-core').default;
const dotenv = require('dotenv')
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const BigNumber = require('bignumber.js');
const Artifacts = require('@8xprotocol/artifacts');

const config = Artifacts.ConfigAddresses[environment.network];
const environment = dotenv.config().parsed;

let provider = new Web3.providers.HttpProvider(environment.NODE_ADDRESS);

if (environment.PRIVATE_KEY) {
    provider = new HDWalletProvider([environment.PRIVATE_KEY.toLowerCase()], environment.NODE_ADDRESS);
    console.log('Private key set sucessfully');
}

let nonceTracker = new NonceTrackerSubprovider()
provider.engine._providers.unshift(nonceTracker)
nonceTracker.setEngine(provider.engine);

let addressBook = {
    volumeSubscriptionAddress: getContract("VolumeSubscription"),
    transactingTokenAddresses: [
        getToken("DAI"), 
        getToken("WETH")
    ],
    executorAddress: getContract("Executor"),
    transferProxyAddress: getContract("TransferProxy"),
    payrollSubscriptionAddress: getContract("PayrollSubscriptiob"),
    stakeContractAddress: getContract("StakeContract"),
    stakeTokenAddress: getToken("EightExToken")
};

const topUpAmount = new BigNumber(100).mul(10 ** 18);

function start() {

    let service = new EthereumService(provider, environment.PUBLIC_KEY.toLowerCase(), addressBook, {
        processing: 0,
        catchLate: 5,
        stopChecking: 10
    });
    
    repeater = new Repeater(service);

    service.attemptTopUp(
        topUpAmount
    ).then(function() {
        console.log('Top up successfull');
        return repeater.start()
    }).then(function() {
        console.log("Started node");
    }).catch(function(error) {
        console.log(error);
    })

    repeater.repeaterUpdated = function() {
        console.log("Repeater events updated");
    };
}

function getToken(ticker) {
    let object = config['approvedTokens'].find((item) => item.ticker == ticker) || { address: '' };
    return object.address;
}
  
function getContract(contract) {
    let object = config['addresses'].find((item) => item.name == contract) || { address: '' };
    return object.address;
}
  
start();