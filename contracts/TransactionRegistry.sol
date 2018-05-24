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

    uint public multiplier;

    /**
      * Modifiers
    */

    /**
      * Public functions
    */

    /** @dev Set a multiplier for how many tokens you need in order to claim proportional to the payments.
      * @param _amount is the multiplier that would like to be set.
    */
    function setMultiplier(uint _amount) public onlyOwner {
        multiplier = _amount;
    } 


    /** @dev Create a new payment object when a user intially subscribes to a plan.
      * @param _subscriptionContract is the contract where the details exist (adheres to Collectable contract interface).
      * @param _subscriptionIdentifier is the identifier o f that customer's subscription with it's relevant details.
      * @param _duedate is when the payment is meant to be paid by.
      * @param _stake is how much the processors has staked in order to have the right to execute the transaction.
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

    /** @dev Claim a payment to execute later on.
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with it's relevant details.
    */
    function claimPayment(bytes32 _subscriptionIdentifier) public onlyAuthorized {

        // @TODO: Implementation

    }

    /** @dev Executed the payment
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with it's relevant details.
    */
    function executePayment(bytes32 _subscriptionIdentifier) public onlyAuthorized {

        // @TODO: Implementation

    }

    /** @dev This function resets the payment details for the next payment cycle. 
             The reason for this being another funct */
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