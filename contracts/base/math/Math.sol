pragma solidity ^0.4.21;


/**
 * @title Math
 * @dev Assorted math operations
 */
library Math {

    function max64(uint64 _a, uint64 _b) internal pure returns (uint64 max) {
        return _a >= _b ? _a : _b;
    }

    function min64(uint64 _a, uint64 _b) internal pure returns (uint64 min) {
        return _a < _b ? _a : _b;
    }

    function max256(uint256 _a, uint256 _b) internal pure returns (uint256 max) {
        return _a >= _b ? _a : _b;
    }

    function min256(uint256 _a, uint256 _b) internal pure returns (uint256 min) {
        return _a < _b ? _a : _b;
    }

}
