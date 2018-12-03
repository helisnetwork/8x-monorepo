pragma solidity ^0.4.24;

import "../Authorizable.sol";

contract WrappableInterface is Authorizable {

        event WithdrawalOnBehalf(address indexed _of, address indexed _from, uint256 _value) public onlyAuthorized;

}