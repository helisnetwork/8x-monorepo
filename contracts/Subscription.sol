pragma solidity ^0.4.0;

import "./Plan.sol";

/** @title Contains all the data required for a user's active subscription. */

contract Subscription {

    struct Payment {
        uint datePaid;
        bool success;
    }

    address public owner; // The owner of the contract being the user in this case

    uint public startDate;
    uint public terminationDate;

    uint public interval;
    uint public amount;

    Payment[] public payments;

    Plan public PLAN_CONTRACT;

    /**
      * Modifiers
    */

    /**
      * External functions
    */

    /**
      * Public functions
    */

    /** @dev This is the constructor function for creating a new subscription
      * @param _owner the address which owns this contract (will be the user in this case)
      * @param _startDate the date from which this subscription should start
      * @param _plan a reference to the plan they would like to subscribe to
    */

    function Subscription(
        address _owner,
        uint _startDate,
        address _plan
    )
        public
    {

        owner = _owner;
        startDate = _startDate;
        PLAN_CONTRACT = Plan(_plan);

        // Although the plan owner can't update the interval or amount we want to be sure that it doesn't change by using a referenced value
        interval = PLAN_CONTRACT.getInterval();
        amount = PLAN_CONTRACT.getAmount();
    }

    /**
      * Internal functions
    */

    /**
      * Private functions
    */

}