pragma solidity ^0.4.21;

import "./Collectable.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract VolumeSubscription is Collectable {

    struct Plan {

        address owner;

        string identifier;
        string name;
        string description; 

        uint terminationDate;
        uint interval;
        uint amount;

        string data;

    }

    struct Subscription {

        address owner;

        bytes32 planHash;

        uint startDate;
        uint nextPaymentDate;
        uint terminationDate;
        
        uint interval;
        uint amount;

        string data;

    }

    mapping (bytes32 => Plan) public plans;
    mapping (bytes32 => Subscription) public subscriptions;

    event CreatedPlan(bytes32 identifier);
    event UpdatedPlan(bytes32 identifier);
    event TerminatedPlan(bytes32 identifier, uint terminationDate);

    event CreatedSubscription(bytes32 identifier);
    event UpdatedSubscription(bytes32 identifier);
    event TerminatedSubscription(bytes32 identifier, uint terminationDate);

    /**
      * Modifiers
    */

    modifier isOwnerOfPlan(bytes32 _plan) {
        require(msg.sender == plans[_plan].owner);
        _;
    }

    modifier shouldEmitPlanChanges(bytes32 _plan) {
        _;
        emit UpdatedPlan(_plan);
    }

    modifier isOwnerOfSubscription(bytes32 _subscription) {
        require(msg.sender == subscriptions[_subscription].owner);
        _;
    }

    modifier shouldEmitSubscriptionChanges(bytes32 _subscription) {
        _;
        emit UpdatedSubscription(_subscription);
    }

    /**
      * Interface functions
    */

    function getBalanceAndAmountDueFromSubscription(bytes32 _subscription)
        public 
        returns (uint _balance, uint _amount) {
        return (getSubscriptionOwner(_subscription).balance, getSubscriptionAmount(_subscription));
    }

    /**
      * External functions
    */

    /** @dev Terminate's the plan in case the merchant wants to discontinue the service.
      * @param _plan is the hash of the user's address + identifier.
      * @param _terminationDate is the date from which they would like to terminate the service.
    */

    function terminatePlan(bytes32 _plan, uint _terminationDate)
        external
        isOwnerOfPlan(_plan) {
        require(_terminationDate >= block.timestamp);
        require(plans[_plan].terminationDate == 0); // If it's already been set then we don't want it to be modified.
        plans[_plan].terminationDate = _terminationDate;
        emit TerminatedPlan(_plan, _terminationDate);
    }

    /** @dev Terminate's the subscription in case the user wants to discontinue the service.
      * @param _subscription is the hash of the user's address + plan's hash.
      * @param _terminationDate is the date from which they would like to terminate the service.
    */

    function terminateSubscription(bytes32 _subscription, uint _terminationDate)
        external
        isOwnerOfSubscription(_subscription) {
        require(_terminationDate >= block.timestamp);
        require(subscriptions[_subscription].terminationDate == 0); // If it's already been set then we don't want it to be modified

        subscriptions[_subscription].terminationDate = _terminationDate;

        emit TerminatedSubscription(_subscription, _terminationDate);
    }

    /**
      * Public functions
    */

    /** @dev This is the function for creating a new plan.
      * @param _owner the address which owns this contract and to which a payment will be made.
      * @param _identifier a way to uniquely identify a product for each vendor.
      * @param _name a front-end displaying name for the product.
      * @param _description a front-end displaying description for the product.
      * @param _interval after how many days should a customer be charged.
      * @param _amount how much should the consumer be charged (in cents).
      * @param _data any extra data they'd like to store.
    */

    function createPlan(
        address _owner, // Required
        string _identifier, // Required
        string _name,
        string _description,
        uint _interval, // Required
        uint _amount, // Required
        string _data
    )
        public
        returns (bytes32 _newPlanHash)
    {

        require(_owner != 0x0);
        require(bytes(_identifier).length > 0);
        require(_interval > 0);
        require(_amount > 0);

        bytes32 newPlanHash = keccak256(_owner, _identifier);
        require(plans[newPlanHash].owner == 0x0);

        Plan memory newPlan = Plan({
            owner: _owner, 
            identifier: _identifier, 
            name: _name, 
            description: _description, 
            terminationDate: 0,
            interval: _interval,
            amount: _amount,
            data: _data
        });

        plans[newPlanHash] = newPlan;

        emit CreatedPlan(newPlanHash);

        return newPlanHash;
    }

    /** dev This is the function for creating a new subscription.
      * @param _owner the address which owns this contract (will be the user in this case).
      * @param _startDate the date from which this subscription should start.
      * @param _planHash a reference to the plan they would like to subscribe to.
      * @param _data any extra data they'd like to store.
    */

    function createSubscription(
        address _owner,
        bytes32 _planHash,
        uint _startDate,
        string _data
    )
        public
        returns (bytes32 _newSubscriptionHash)
    {
        require(_owner != 0x0);
        require(_startDate >= block.timestamp);

        uint planInterval = getPlanInterval(_planHash);
        uint planAmount = getPlanAmount(_planHash);

        bytes32 newSubscriptionHash = keccak256(_owner, _planHash);

        require(subscriptions[newSubscriptionHash].owner == 0x0);
        require(planInterval > 0); // If an invalid hash isn't provided then it will be 0.
        require(planAmount > 0); // If an invalid hash isn't provided then it will be 0.

        Subscription memory newSubscription = Subscription({
            owner: _owner, 
            planHash: _planHash, 
            startDate: _startDate, 
            nextPaymentDate: 0,
            terminationDate: 0,
            interval: planInterval,
            amount: planAmount,
            data: _data
        });

        subscriptions[newSubscriptionHash] = newSubscription;

        emit CreatedSubscription(newSubscriptionHash);

        return newSubscriptionHash;
    }

    /** @dev Updates the plan's owner in case they want to receive funds in another address.
      * @param _plan is the hash of the user's address + identifier.
      * @param _owner the address which they want to update it to.
    */

    function setPlanOwner(bytes32 _plan, address _owner) 
        public
        isOwnerOfPlan(_plan)
        shouldEmitPlanChanges(_plan) {
        if (_owner != address(0)) {
            plans[_plan].owner = _owner;
        }
    }

    /** @dev Updates the name of the product (visible to the user).
      * @param _plan is the hash of the user's address + identifier.
      * @param _name the name which they want to update it to.
    */

    function setPlanName(bytes32 _plan, string _name) 
        public
        isOwnerOfPlan(_plan)
        shouldEmitPlanChanges(_plan) {
        plans[_plan].name = _name;
    }

    /** @dev Updates the description of the product (visible to the user).
      * @param _plan is the hash of the user's address + identifier.
      * @param _description the description which they want to update it to.
    */

    function setPlanDescription(bytes32 _plan, string _description) 
        public
        isOwnerOfPlan(_plan)
        shouldEmitPlanChanges(_plan) {
        plans[_plan].description = _description;
    }

    /** @dev Updates the data field which can be used to store anything extra.
      * @param _plan is the hash of the user's address + identifier.
      * @param _data the data which they want to update it to.
    */

    function setPlanData(bytes32 _plan, string _data) 
        public
        isOwnerOfPlan(_plan)
        shouldEmitPlanChanges(_plan) {
        plans[_plan].data = _data;
    }

    /** @dev Updates the data field which can be used to store anything extra.
      * @param _subscription is the hash of the user's address + identifier.
      * @param _data the data which they want to update it to.
    */

    function setSubscriptionData(bytes32 _subscription, string _data) 
        public
        isOwnerOfSubscription(_subscription)
        shouldEmitSubscriptionChanges(_subscription) {
        subscriptions[_subscription].data = _data;
    }

    /** @dev Retrieve a plan from the plans mapping by providing an identifier.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlan(bytes32 _plan)
        view
        public
        returns (
            address _owner,
            string _identifier,
            string _name,
            string _description,
            uint _terminationDate,
            uint _interval,
            uint _amount,
            string _data
        )
    {
        Plan storage plan = plans[_plan];
        return (
            plan.owner,
            plan.identifier,
            plan.name,
            plan.description,
            plan.terminationDate,
            plan.interval,
            plan.amount,
            plan.data
        );
    }

    /** @dev Get the owner for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanOwner(bytes32 _plan)
        public
        view 
        returns (address _owner) {
        return plans[_plan].owner;
    }

     /** @dev Get the identifier for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanIdentifier(bytes32 _plan)
        public
        view 
        returns (string _identifier) {
        return plans[_plan].identifier;
    }

    /** @dev Get the description for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanDescription(bytes32 _plan)
        public
        view 
        returns (string _description) {
        return plans[_plan].description;
    }

    /** @dev Get the name for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanName(bytes32 _plan)
        public
        view 
        returns (string _name) {
        return plans[_plan].name;
    }

    /** @dev Get the termination date for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanTerminationDate(bytes32 _plan)
        public
        view 
        returns (uint _terminationDate) {
        return plans[_plan].terminationDate;
    }
    
    /** @dev Get the interval for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanInterval(bytes32 _plan)
        public
        view 
        returns (uint _interval) {
        return plans[_plan].interval;
    }

    /** @dev Get the amount for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanAmount(bytes32 _plan)
        public
        view 
        returns (uint _amount) {
        return plans[_plan].amount;
    }

    /** @dev Get the extra data for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */

    function getPlanData(bytes32 _plan)
        public
        view 
        returns (string _data) {
        return plans[_plan].data;
    }

    /** @dev Retrieve a subscription from the subscriptions mapping by providing an identifier.
      * @param _subscription is the hash of the user's address + plan's hash.
    */

    function getSubscription(bytes32 _subscription)
        view
        public
        returns (
            address _owner,
            bytes32 _planHash,
            uint _startDate,
            uint _nextPaymentDate,
            uint _terminationDate,
            uint _interval,
            uint _amount,
            string _data
        )
    {
        Subscription storage subscription = subscriptions[_subscription];
        return (
            subscription.owner,
            subscription.planHash,
            subscription.startDate,
            subscription.nextPaymentDate,
            subscription.terminationDate,
            subscription.interval,
            subscription.amount,
            subscription.data
        );
    }

    /** @dev Get the owner of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionOwner(bytes32 _subscription)
        public
        view 
        returns (address _owner) {
        return subscriptions[_subscription].owner;
    }

    /** @dev Get the plan hash of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionPlanHash(bytes32 _subscription)
        public
        view 
        returns (bytes32 _planHash) {
        return subscriptions[_subscription].planHash;
    }

    /** @dev Get the start date of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionStartDate(bytes32 _subscription)
        public
        view 
        returns (uint _startDate) {
        return subscriptions[_subscription].startDate;
    }

    /** @dev Get the next payment date of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionNextPaymentDate(bytes32 _subscription)
        public
        view 
        returns (uint _nextPaymentDue) {
        return subscriptions[_subscription].nextPaymentDate;
    }

    /** @dev Get the termination date for the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionTerminationDate(bytes32 _subscription)
        public
        view 
        returns (uint _terminationDate) {
        return subscriptions[_subscription].terminationDate;
    }

    /** @dev Get the interval of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionInterval(bytes32 _subscription)
        public
        view 
        returns (uint _interval) {
        return subscriptions[_subscription].interval;
    }

    /** @dev Get the amount of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionAmount(bytes32 _subscription)
        public
        view 
        returns (uint _amount) {
        return subscriptions[_subscription].amount;
    }
    
    /** @dev Get the extra data for the plan.
      * @param _subscription is the hash of the user's address + identifier.
    */

    function getSubscriptionData(bytes32 _subscription)
        public
        view 
        returns (string _data) {
        return subscriptions[_subscription].data;
    }

    /**
      * Internal functions
    */

    /**
      * Private functions
    */

}