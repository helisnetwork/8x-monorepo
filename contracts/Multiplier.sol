pragma solidity 0.4.24;

/** @title Contract which determines how many tokens are needed for a subscription */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Multiplier {

    uint public minimumGiniCoefficient;
    uint public maximumGiniCoefficient;

    constructor(uint _minimum, uint _maximum) public {

        // @TODO: Implementation

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

    function setMinimumCoefficient(uint _minimum) public {

        // @TODO: Implementation

    }

    function setMaximumCoefficient(uint _maximum) public {

        // @TODO: Implementation

    }

}