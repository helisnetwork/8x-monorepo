import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var Executor = artifacts.require("./Executor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let executorContract;
    let proxyContract;
    let tokenContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let subscriber = accounts[2]; // User paying $100/month subscription
    let serviceNode = accounts[3]; // Collector party claiming payment

    let planIdentifier;

    before(async function() {

        subscriptionContract = await MockVolumeSubscription.new({from: contractOwner});
        executorContract = await Executor.new({from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        tokenContract = await EightExToken.new({from: contractOwner});

    });

    describe("when businesses creates subscriptions", () => {

        // @TODO: Implementation

    });

    describe("when users subscribe to subscriptions", () => {

        // @TODO: Implementation

    });

    describe("when service nodes process subscriptions", () => {

        // @TODO: Implementation

    });

    describe("when service nodes cancel a subscription", () => {

        // @TODO: Implementation

    });

    describe("when businesses cancel a subscription", () => {

        // @TODO: Implementation

    });

    describe("when users don't have enough funds in their wallet", () => {

        // @TODO: Implementation

    });

});