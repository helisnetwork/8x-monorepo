import assertRevert from './helpers/assert_revert.js';

var Requirements = artifacts.require('./Requirements.sol');

contract('Requirements', function(accounts) {

    let requirementsContract;

    before(async function() {

        requirementsContract = await Requirements.new(10, {from: accounts[0]});

    });

    /*
        function getStake(
            uint _gini,
            uint _dependentConstant,
            uint _divideBy,
            uint _startDate,
            uint _claimDate,
            uint _maximumClaimDate,
            uint _totalUnlocked
        )
    */

    describe("precursor conditions", () => {

        it("should throw if n is zero", async function() {

            await assertRevert(requirementsContract.getStake(
                500,        // Gini
                6643,       // Dependent constant
                1,          // Divided by
                10,         // Start date
                15,         // Claim date
                20,         // Maximum claim date
                0           // Total unlocked
            ));

        });

        it("should throw if the gini coefficient is zero", async function() {

            await assertRevert(requirementsContract.getStake(
                0,          // Gini
                6643,       // Dependent constant
                1,          // Divided by
                10,         // Start date
                11,         // Claim date
                20,         // Maximum claim date
                10          // Total unlocked
            ));

        });


        it("should throw if the dependent constant is zero", async function() {

            await assertRevert(requirementsContract.getStake(
                500,        // Gini
                0,          // Dependent constant
                1,          // Divided by
                10,         // Start date
                11,         // Claim date
                20,         // Maximum claim date
                10          // Total unlocked
            ));

        });

        it("should throw if the divide by is zero", async function() {

            await assertRevert(requirementsContract.getStake(
                500,        // Gini
                6643,       // Dependent constant
                0,          // Divided by
                10,         // Start date
                11,         // Claim date
                20,         // Maximum claim date
                10          // Total unlocked
            ));

        });

        it("should throw if the maximum claim date is before the start date", async function() {

            await assertRevert(requirementsContract.getStake(
                500,        // Gini
                6643,       // Dependent constant
                1,          // Divided by
                10,         // Start date
                11,         // Claim date
                9,          // Maximum claim date
                10          // Total unlocked
            ));

        });

    })

    describe("when the gini coefficient = 0.5, beginning stake = 1000 and the end stake = 1%", () => {

        it("should return the correct stake at time 0", async function() {

            let stake = await requirementsContract.getStake(
                500,        // Gini
                6643,       // Dependent constant
                1,          // Divided by
                10,         // Start date
                10,         // Claim date
                20,         // Maximum claim date
                1000        // Total unlocked
            )

            assert.equal(stake, 1000);

        });

        it("should return the correct stake half way through", async function() {

            let stake = await requirementsContract.getStake(
                500,        // Gini
                6643,       // Dependent constant
                1,          // Divided by
                10,         // Start date
                15,         // Claim date
                20,         // Maximum claim date
                1000        // Total unlocked
            )

            assert.equal(stake.toNumber(), 100);

        });

        it("should return the correct stake by the end", async function() {

            let stake = await requirementsContract.getStake(
                500,        // Gini
                6643,       // Dependent constant
                1,          // Divided by
                10,         // Start date
                19,         // Claim date
                20,         // Maximum claim date
                1000        // Total unlocked
            )

            assert.equal(stake.toNumber(), 100);

        });

    });

});