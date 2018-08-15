pragma solidity 0.4.24;

/** @title Contract which determines how many tokens are needed for a subscription */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Multiplier {

    uint public minimumGiniCoefficient;
    uint public maximumGiniCoefficinet;

    constructor(uint _minimum, uint _maximum) public {
        minimumGiniCoefficient = _minimum;
        maximumGiniCoefficinet = _maximum;
    }

    function getRequiredStake(
        uint _dueDate,
        uint _claimDate,
        uint _maximumClaimDate,
        uint _amount,
        uint _totalUnstaked
    )
        public
        returns (uint)
    {

      // @TODO: Implementation

    }

}