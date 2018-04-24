import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var Executor = artifacts.require("./Executor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var VolumeSubscription = artifacts.require("./VolumeSubscription.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let executorContract;
    let proxyContract;

    before(async function() {

      //contract = await VolumeSubscription.new({from: accounts[0]});
        
    });

});