const web3 = require('web3');
const keccak = require('./helpers/keccak');
const assertRevert = require('./helpers/assert_revert');

var MockVolumeSubscription = artifacts.require("./test/MockVolumeSubscription.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var MockKyberNetwork = artifacts.require("./test/MockKyberNetwork.sol");

contract('VolumeSubscription', function(accounts) {

    let contract;
    let token;

    let contractOwner = accounts[0]; // Owner of the actual contract
    let executorContract = accounts[1]; // Authorized address that can create plans and subscriptions
    let business = accounts[2]; // The business who has a subscription they want to earn money from
    let subscriber = accounts[3]; // The user who is paying the business
    let unauthorizedAddress = accounts[4]; // Someone random
    let approvedRegistryContract;
    let kyberNetwork;

    before(async function() {

        kyberNetwork = await MockKyberNetwork.new({ from: contractOwner });
        approvedRegistryContract = await ApprovedRegistry.new(kyberNetwork.address, { from: contractOwner });

        contract = await MockVolumeSubscription.new(approvedRegistryContract.address, { from: accounts[0] });
        token = await EightExToken.new({ from: accounts[0] });

        await contract.addAuthorizedAddress(executorContract);

    });

});