pragma solidity 0.4.24;

import "./Collectible.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract VolumeSubscription is Collectible {

    struct Plan {

        address owner;
        address tokenAddress;

        string identifier;
        string name;
        string description;

        uint terminationDate;
        uint interval;
        uint amount;
        uint fee;

        string data;

    }

    struct Subscription {

        address owner;
        address tokenAddress;

        bytes32 planHash;

        uint startDate;
        uint nextPaymentDate;
        uint terminationDate;

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
      * EXTERNAL FUNCTIONS
    */
    /** @dev Terminate's the plan in case the merchant wants to discontinue the service.
      * @param _plan is the hash of the user's address + identifier.
      * @param _terminationDate is the date from which they would like to
      * terminate the service.
    */
    function terminatePlan(bytes32 _plan, uint _terminationDate)
        external
        isOwnerOfPlan(_plan)
    {
        require(_terminationDate >= currentTimestamp());

        // If it's already been set then we don't want it to be modified.
        require(plans[_plan].terminationDate == 0);

        plans[_plan].terminationDate = _terminationDate;

        emit TerminatedPlan(_plan, _terminationDate);
    }

    /** @dev Terminate's the subscription in case the user wants to discontinue the service.
      * @param _subscription is the hash of the user's address + plan's hash.
      * @param _terminationDate is the date from which they would like to
      * terminate the service.
    */
    function terminateSubscription(bytes32 _subscription, uint _terminationDate)
        external
        isOwnerOfSubscription(_subscription)
    {
        require(_terminationDate >= currentTimestamp());

        // If it's already been set then we don't want it to be modified
        require(subscriptions[_subscription].terminationDate == 0);

        subscriptions[_subscription].terminationDate = _terminationDate;

        emit TerminatedSubscription(_subscription, _terminationDate);
    }

    /**
      * COLLECTIBLE INTERFACE FUNCTIONS
    */
    function isValidSubscription(bytes32 _subscription)
        public
        view
        returns (bool success)
    {
        return (getSubscriptionTerminationDate(_subscription) == 0);
    }

    function getSubscriptionTokenAddress(bytes32 _subscription)
        public
        view
        returns (address subscriptionTokenAddress)
    {
        return subscriptions[_subscription].tokenAddress;
    }

    function getSubscriptionFromToAddresses(bytes32 _subscription)
        public
        view
        returns (address from, address to)
    {
        bytes32 planHash = getSubscriptionPlanHash(_subscription);
        return (getSubscriptionOwner(_subscription), getPlanOwner(planHash));
    }

    function getSubscriptionOwnerBalance(bytes32 _subscription)
        public
        view
        returns (uint balance)
    {
        return getSubscriptionOwner(_subscription).balance;
    }

    function getAmountDueFromSubscription(bytes32 _subscription)
        public
        view
        returns (uint amount)
    {
        bytes32 planHash = getSubscriptionPlanHash(_subscription);
        return plans[planHash].amount;
    }

    function getSubscriptionFee(bytes32 _subscription)
        public
        view
        returns (uint fee)
    {
        bytes32 planHash = getSubscriptionPlanHash(_subscription);
        return plans[planHash].fee;
    }

    function terminateSubscriptionDueToInsufficientFunds(bytes32 _subscription)
        public
        onlyAuthorized
    {
        subscriptions[_subscription].terminationDate = currentTimestamp();
        emit TerminatedSubscription(_subscription, currentTimestamp());
    }

    /**
      * PUBLIC FUNCTIONS
    */
    /** @dev This is the function for creating a new plan.
      * @param _owner the address which owns this contract and to which a
      * payment will be made.
      * @param _identifier a way to uniquely identify a product for each vendor.
      * @param _name a front-end displaying name for the product.
      * @param _description a front-end displaying description for the product.
      * @param _interval after how many days should a customer be charged.
      * @param _amount how much should the consumer be charged (in cents).
      * @param _data any extra data they'd like to store.
    */
    function createPlan(
        address _owner, // Required
        address _tokenAddress, // Required
        string _identifier, // Required
        string _name,
        string _description,
        uint _interval, // Required
        uint _amount, // Required
        uint _fee, // Required
        string _data
    )
        public
        returns (bytes32 newPlanHash)
    {

        require(_owner != 0x0);
        require(_tokenAddress != 0x0);
        require(bytes(_identifier).length > 0);
        require(_interval > 0);
        require(_amount > 0);
        require(_fee >= 0);
        require(_fee <= _amount);

        bytes32 planHash = keccak256(abi.encodePacked(_owner, _identifier));
        require(plans[planHash].owner == 0x0);

        Plan memory newPlan = Plan({
            owner: _owner,
            tokenAddress: _tokenAddress,
            identifier: _identifier,
            name: _name,
            description: _description,
            terminationDate: 0,
            interval: _interval,
            amount: _amount,
            fee: _fee,
            data: _data
        });

        plans[planHash] = newPlan;

        emit CreatedPlan(planHash);

        return planHash;
    }

    /** dev This is the function for creating a new subscription.
      * @param _owner the user address that owns this contract.
      * @param _startDate the date from which this subscription should start.
      * @param _planHash a reference to the subscribed plan
      * @param _data extra data store.
    */
    function createSubscription(
        address _owner,
        bytes32 _planHash,
        uint _startDate,
        string _data
    )
        public
        returns (bytes32 newSubscriptionHash)
    {
        // @TODO: Check for overflows and underflows

        require(_owner != 0x0);
        require(_startDate >= currentTimestamp());

        address planTokenAddress = getPlanTokenAddress(_planHash);

        bytes32 subscriptionHash =
            keccak256(abi.encodePacked(_owner, _planHash));

        require(subscriptions[subscriptionHash].owner == 0x0);
        require(planTokenAddress != 0x0);

        Subscription memory newSubscription = Subscription({
            owner: _owner,
            tokenAddress: planTokenAddress,
            planHash: _planHash,
            startDate: _startDate,
            nextPaymentDate: 0,
            terminationDate: 0,
            data: _data
        });

        subscriptions[subscriptionHash] = newSubscription;

        emit CreatedSubscription(subscriptionHash);

        return subscriptionHash;
    }

    /** @dev Updates the plan's owner.
      * @param _plan is the hash of the user's address + identifier.
      * @param _owner the address which they want to update it to.
    */
    function setPlanOwner(bytes32 _plan, address _owner)
        public
        isOwnerOfPlan(_plan)
        shouldEmitPlanChanges(_plan)
    {
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
        shouldEmitPlanChanges(_plan)
    {
        plans[_plan].name = _name;
    }

    /** @dev Updates the description of the product (visible to the user).
      * @param _plan is the hash of the user's address + identifier.
      * @param _description the description which they want to update it to.
    */
    function setPlanDescription(bytes32 _plan, string _description)
        public
        isOwnerOfPlan(_plan)
        shouldEmitPlanChanges(_plan)
    {
        plans[_plan].description = _description;
    }

    /** @dev Updates the data field which can be used to store anything extra.
      * @param _plan is the hash of the user's address + identifier.
      * @param _data the data which they want to update it to.
    */
    function setPlanData(bytes32 _plan, string _data)
        public
        isOwnerOfPlan(_plan)
        shouldEmitPlanChanges(_plan)
    {
        plans[_plan].data = _data;
    }

    /** @dev Updates the data field which can be used to store anything extra.
      * @param _subscription is the hash of the user's address + identifier.
      * @param _data the data which they want to update it to.
    */
    function setSubscriptionData(bytes32 _subscription, string _data)
        public
        isOwnerOfSubscription(_subscription)
        shouldEmitSubscriptionChanges(_subscription)
    {
        subscriptions[_subscription].data = _data;
    }

    /** @dev Retrieve a plan from the plans mapping by providing an identifier.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlan(bytes32 _plan)
        public
        view
        returns (
            address owner,
            string identifier,
            string name,
            string description,
            uint terminationDate,
            uint interval,
            uint amount,
            uint fee,
            string data
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
            plan.fee,
            plan.data
        );
    }

    /** @dev Get the owner for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanOwner(bytes32 _plan)
        public
        view
        returns (address owner)
    {
        return plans[_plan].owner;
    }

    /** @dev Get the token address for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanTokenAddress(bytes32 _plan)
        public
        view
        returns (address owner)
    {
        return plans[_plan].tokenAddress;
    }

     /** @dev Get the identifier for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanIdentifier(bytes32 _plan)
        public
        view
        returns (string identifier)
    {
        return plans[_plan].identifier;
    }

    /** @dev Get the description for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanDescription(bytes32 _plan)
        public
        view
        returns (string description)
    {
        return plans[_plan].description;
    }

    /** @dev Get the name for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanName(bytes32 _plan)
        public
        view
        returns (string name)
    {
        return plans[_plan].name;
    }

    /** @dev Get the termination date for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanTerminationDate(bytes32 _plan)
        public
        view
        returns (uint terminationDate)
    {
        return plans[_plan].terminationDate;
    }

    /** @dev Get the interval for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanInterval(bytes32 _plan)
        public
        view
        returns (uint interval)
    {
        return plans[_plan].interval;
    }

    /** @dev Get the amount for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanAmount(bytes32 _plan)
        public
        view
        returns (uint amount)
    {
        return plans[_plan].amount;
    }

    /** @dev Get the extra data for the plan.
      * @param _plan is the hash of the user's address + identifier.
    */
    function getPlanData(bytes32 _plan)
        public
        view
        returns (string data)
    {
        return plans[_plan].data;
    }

    /** @dev Retrieve a subscription by providing an identifier.
      * @param _subscription is the hash of the user's address + plan's hash.
    */
    function getSubscription(bytes32 _subscription)
        public
        view
        returns (
            address owner,
            bytes32 planHash,
            uint startDate,
            uint nextPaymentDate,
            uint terminationDate,
            uint interval,
            uint amount,
            string data
        )
    {
        Subscription storage subscription = subscriptions[_subscription];
        return (
            subscription.owner,
            subscription.planHash,
            subscription.startDate,
            subscription.nextPaymentDate,
            subscription.terminationDate,
            plans[planHash].interval,
            plans[planHash].amount,
            subscription.data
        );
    }

    /** @dev Get the owner of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */
    function getSubscriptionOwner(bytes32 _subscription)
        public
        view
        returns (address owner)
    {
        return subscriptions[_subscription].owner;
    }

    /** @dev Get the plan hash of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */
    function getSubscriptionPlanHash(bytes32 _subscription)
        public
        view
        returns (bytes32 planHash)
    {
        return subscriptions[_subscription].planHash;
    }

    /** @dev Get the start date of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */
    function getSubscriptionStartDate(bytes32 _subscription)
        public
        view
        returns (uint startDate)
    {
        return subscriptions[_subscription].startDate;
    }

    /** @dev Get the next payment date of the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */
    function getSubscriptionNextPaymentDate(bytes32 _subscription)
        public
        view
        returns (uint nextPaymentDue)
    {
        return subscriptions[_subscription].nextPaymentDate;
    }

    /** @dev Get the termination date for the subscription.
      * @param _subscription is the hash of the user's address + identifier.
    */
    function getSubscriptionTerminationDate(bytes32 _subscription)
        public
        view
        returns (uint terminationDate)
    {
        return subscriptions[_subscription].terminationDate;
    }

    /** @dev Get the extra data for the plan.
      * @param _subscription is the hash of the user's address + identifier.
    */
    function getSubscriptionData(bytes32 _subscription)
        public
        view
        returns (string data)
    {
        return subscriptions[_subscription].data;
    }

    /**
      * INTERNAL FUNCTIONS
    */
    /** @dev Current timestamp returned via a function in order for mocks in tests
    */
    function currentTimestamp()
        internal
        view
        returns (uint timetstamp)
    {
        // solhint-disable-next-line
        return block.timestamp;
    }

}