pragma solidity 0.4.24;

import "./interfaces/RequirementsInterface.sol";

/** @title Contract which determines how many tokens are needed for a subscription */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Requirements is RequirementsInterface {

    function getStake(
        uint _gini,
        uint _dependentConstant,
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

        require(_gini > 0);
        require(_dependentConstant > 0);
        require(_divideBy > 0);
        require(_startDate > 0);
        require(_totalUnlocked > 0);

        require(_claimDate >= _startDate);
        require(_maximumClaimDate >= _claimDate);

        if (_startDate == _claimDate) {
            return _totalUnlocked / _divideBy;
        }

        // ((n*g^((n/x)-(n^2-x^2)/(n*x)))*(1000^((n^2-x^2)/(n*x))))/1000^(n/x)

        uint n = _totalUnlocked / _divideBy;
        uint x = (((_maximumClaimDate - _claimDate) * n * _dependentConstant * 4)) / (3 * 1000 * (_maximumClaimDate - _startDate));

        if (n <= x) {

            // Standard formula

            uint b = ((1000 ** 2) - (_gini ** 2)) / (1000 * _gini);

            return n * (((1000 / _gini) - b) ** ( x / n));
        }

        // Derived formula

        uint z = n / x;
        uint v = ((n ** 2) - (x ** 2)) / ( x * n);

        return ((n * (_gini ** (z - v))) * (1000 ** v)) / (1000 ** z);
    }

}