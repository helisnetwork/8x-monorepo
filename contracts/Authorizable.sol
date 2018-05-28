pragma solidity ^0.4.21;

import "./base/ownership/Ownable.sol";

/** @title Authorizable - Gives permission to multiple parties in order to execute transactions */
/** @author Originally adapted from ZeroEx (0x): Amir Bandeali - <amir@0xProject.com>, Will Warren - <will@0xProject.com> */

contract Authorizable is Ownable {

    /** @dev Only authorized addresses can invoke functions with this modifier. */

    modifier onlyAuthorized {
        require(authorized[msg.sender]);
        _;
    }

    modifier targetAuthorized(address target) {
        require(authorized[target]);
        _;
    }

    modifier targetNotAuthorized(address target) {
        require(!authorized[target]);
        _;
    }

    mapping (address => bool) public authorized;
    address[] public authorities;

    event LogAuthorizedAddressAdded(address indexed target, address indexed caller);
    event LogAuthorizedAddressRemoved(address indexed target, address indexed caller);

    /**
     * Public functions
    */

    /** @dev Authorizes an address.
      * @param target Address to authorize.
    */

    function addAuthorizedAddress(address target)
        public
        onlyOwner
        targetNotAuthorized(target)
    {
        authorized[target] = true;
        authorities.push(target);

        emit LogAuthorizedAddressAdded(target, msg.sender);
    }

    /** @dev Removes authorizion of an address.
      * @param target Address to remove authorization from.
    */

    function removeAuthorizedAddress(address target)
        public
        onlyOwner
        targetAuthorized(target)
    {
        delete authorized[target];
        for (uint i = 0; i < authorities.length; i++) {
            if (authorities[i] == target) {
                authorities[i] = authorities[authorities.length - 1];
                authorities.length -= 1;
                break;
            }
        }

        emit LogAuthorizedAddressRemoved(target, msg.sender);
    }

    /*
     * Public constant functions
    */

    /** @dev Gets all authorized addresses.
      * @return Array of authorized addresses.
    */

    function getAuthorizedAddresses()
        public
        constant
        returns (address[])
    {
        return authorities;
    }

}
