pragma solidity ^0.4.18;

import "./Authorizable.sol";

/** @title Transaction Registry - Stores a list of all the currently pending transactions */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract TransactionRegistry is Authorizable {

    struct Payment {
        address subscriptionContract;

        uint duedate;
        uint lastPaymentDate;

        address claimant;
        uint stake;
        uint claimDate;
    }

    mapping (bytes32 => Payment) public payments;

    /**
      * Modifiers
    */

    /**
      * Public functions
    */

    function createNewPayment(
        bytes32 _subscriptionIdentifier, 
        address _subscriptionContract,
        uint _duedate,
        uint _stake)
    
        public
        onlyAuthorized
        returns (bool _success)
    {

        // @TODO: Implementation

    }

    function claimPayment(bytes32 _subscriptionIdentifier) public onlyAuthorized {

        // @TODO: Implementation

    }

    function executePayment(bytes32 _subscriptionIdentifier) public onlyAuthorized {

        // @TODO: Implementation

    }

    function updateForNextPayment(
        bytes32 _subscriptionIdentifier, 
        uint _duedate, 
        uint _stake
    ) 
        public 
        onlyAuthorized 
        returns (bool _success)
    {

        // @TODO: Implementation

    }
    
}