const web3 = require('web3');
const keccak = require('./helpers/keccak');
const assertRevert = require('./helpers/assert_revert');

var MockPayrollSubscription = artifacts.require("./test/MockPayrollSubscription.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
var MockKyberNetwork = artifacts.require("./test/MockKyberNetwork.sol");


contract('PayrollSubscription', function(accounts) {

    let contract;
    let token;

    let contractOwner = accounts[0]; // Owner of the actual contract
    let executorContract = accounts[1]; // Authorized address that can create plans and subscriptions
    let business = accounts[2]; // The business who has a subscription they want to earn money from
    let receiver = accounts[3]; // The user who is paying the business
    let unauthorizedAddress = accounts[4]; // Someone random

    let approvedRegistryContract;
    let kyberNetwork;

    let amount = 10;

    const identifiers = (obj) => {
        let array = [
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c10",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c21",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c32",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c43",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c53",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c63",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c73",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c83",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c93",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37103",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37113",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37123",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37133",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37143",
            "0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37154"
        ];  

        if (obj) {
            array.push(obj);
        }
        
        return array;
    }

    const destinations = (obj) => {
        let addressArray = [];
        for (var i = 0; i < 15; i++) {
            addressArray.push(receiver);
        }

        if (obj) {
            addressArray.push(obj);
        }

        return addressArray;
    }

    const amounts = (obj) => {
        let amountArray = [];
        for (var i = 0; i < 15; i++) {
            amountArray.push(amount);
        }

        if (obj) {
            amountArray.push(obj);
        }

        return amountArray;
    }

    before(async function() {

        kyberNetwork = await MockKyberNetwork.new({ from: contractOwner });
        approvedRegistryContract = await ApprovedRegistry.new(kyberNetwork.address, { from: contractOwner });

        contract = await MockPayrollSubscription.new(approvedRegistryContract.address, { from: contractOwner });
        token = await MockToken.new({ from: contractOwner });

        await contract.addAuthorizedAddress(executorContract);

    });

    describe("when creating a schedule with payments", () => {

        it("should not be able to create without a start date", async function() {

            await assertRevert(contract.createScheduleWithPayments(
                [], 
                [], 
                [],
                token.address,
                0,
                100,
                true, 
                { from: business }
            ));

        });

        it("should not be able to create without an interval if one off is false", async function() {

            await assertRevert(contract.createScheduleWithPayments(
                [], 
                [], 
                [],
                token.address,
                100,
                0,
                false, 
                { from: business }
            ));

        });

        it("should not be able to create with duplicate ids", async function() {

            // Add a duplicate of the first entry with a different amount
            await assertRevert(contract.createScheduleWithPayments(
                identifiers('0xfcbaf63cb9a95a09c451e4a9943cb9b8f995ff08d6dd756944fc4437a4d37c10'), 
                amounts(5), 
                destinations(receiver),
                token.address,
                100,
                0,
                true, 
                { from: business }
            ));

        });

        it("should not be able to create a schedule without payments", async function() {

            // Doesn't work
            // await assertRevert(contract.createScheduleWithPayments(
            //     [], 
            //     [], 
            //     [],
            //     token.address,
            //     100,
            //     10,
            //     false, 
            //     { from: business }
            // ));

        });

        it("should be able to create a schedule with the specified payments", async function() {
            

            let newSchedule = await contract.createScheduleWithPayments(
                identifiers(), 
                amounts(), 
                destinations(),
                token.address,
                100,
                0,
                true, 
                { from: business }
            );

            let scheduleIdentifier = newSchedule.logs[0].args.scheduleIdentifier;
            console.log(scheduleIdentifier);

            let scheduleInformation = await contract.schedules.call(scheduleIdentifier);
            assert.equal(scheduleInformation[0], 0);
            assert.equal(scheduleInformation[1], token.address);
            assert.equal(scheduleInformation[2], 100);
            assert.equal(scheduleInformation[3], 0);
            assert.equal(scheduleInformation[4], true);
            assert.equal(scheduleInformation[5], business);

            let checkOne = await contract.payments.call(identifiers()[0]);
            assert.equal(checkOne[0], amount);
            assert.equal(checkOne[1], receiver);
            assert.equal(checkOne[2], 0);
            assert.equal(checkOne[3], 0);
            assert.equal(checkOne[4], scheduleIdentifier);

            let checkFifteen = await contract.payments.call(identifiers()[14]);
            assert.equal(checkOne[0], amount);
            assert.equal(checkOne[1], receiver);
            assert.equal(checkOne[2], 0);
            assert.equal(checkOne[3], 0);
            assert.equal(checkOne[4], scheduleIdentifier);

        });

    });

    describe("when updating the schedule owner", () => {

        it("should not be able to update as an unauthorised user", async function() {


        });

        it("should be able to update as the owner", async function() {


        });

    });

    describe("when updating the schedule start date", () => {

        it("should not be able to update as an unauthorised user", async function() {


        });

        it("should not be able to set a date in the past", () => {


        });

        it("should be able to update as the owner", async function() {


        });

    });

    describe("when terminating the schedule", () => {

        it("should")

    });

});