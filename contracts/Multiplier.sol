pragma solidity 0.4.24;

import "./MultiplierInterface.sol";

/** @title Contract which determines how many tokens are needed for a subscription */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Multiplier is MultiplierInterface {

    uint public giniCoefficient; // Minimum to underfit data, 3 decimal places.
    uint public divideTotalBy;

    constructor(uint _gini, uint _divideTotalBy) public {
        giniCoefficient = _gini;
        divideTotalBy = _divideTotalBy;
    }

    function getMultiplier(
        uint _startDate,
        uint _claimDate,
        uint _maximumClaimDate,
        uint _totalUnlocked
    )
        public
        view
        returns (uint)
    {
        uint startingPoint = _totalUnlocked / divideTotalBy;
        uint units = (_maximumClaimDate - _startDate) / (_claimDate - _startDate);
        uint xValue = (_claimDate - _startDate) / units;
        uint exponent = 1 / (xValue * startingPoint);

        return startingPoint * ((giniCoefficient/1000) ** exponent);
    }

    function setGiniCoefficient(uint _gini) public onlyOwner {
        giniCoefficient = _gini;
    }

    function setDivideTotalBy(uint _divideTotalBy) public onlyOwner {
        divideTotalBy = _divideTotalBy;
    }

}