pragma solidity ^0.4.24;

import "../Authorizable.sol";

contract WrappableInterface is Authorizable {

    /** @dev Unwrap Ether on behalf of another user. Doesn't give any custody rights.
      * @param _value how much you'd like to unwrap.
      * @param _owner the person you'd like to unwrap on behalf of.
    */
    function withdrawOnBehalfOf(uint256 _value, address _owner) public;

    event WithdrawalOnBehalf(address indexed _of, address indexed _from, uint256 _value);

}