pragma solidity 0.4.24;

import "./RequirementsInterface.sol";

/** @title Contract which determines how many tokens are needed for a subscription */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Requirements is RequirementsInterface {

    function getStake(
        uint _gini,
        uint _divideBy,
        uint _startDate,
        uint _claimDate,
        uint _maximumClaimDate,
        uint _totalUnlocked
    )
        public
        view
        returns (uint)
    {
        uint startingPoint = _totalUnlocked / _divideBy;
        uint units = (_maximumClaimDate - _startDate) / (_claimDate - _startDate);
        uint xValue = (_claimDate - _startDate) / units;
        uint exponent = 1 / (xValue * startingPoint);

        return startingPoint * ((_gini/1000) ** exponent);
    }

}