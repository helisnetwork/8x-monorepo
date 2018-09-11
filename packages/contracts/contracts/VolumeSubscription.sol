pragma solidity 0.4.24;

import "./Collectable.sol";
import "./interfaces/ApprovedRegistryInterface.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract VolumeSubscription is Collectable {

    struct Plan {

        address owner;
        address tokenAddress;

        bytes32 identifier;

        uint interval;
        uint amount;
        uint fee;

        string data;
        uint terminationDate;

    }

    struct Subscription {

        address owner;
        address tokenAddress;

        bytes32 planHash;

        uint lastPaymentDate;
        uint terminationDate;

        string data;
    }

    ApprovedRegistryInterface public approvedRegistry;

    mapping (bytes32 => Plan) public plans;
    mapping (bytes32 => Subscription) public subscriptions;

    event CreatedPlan(
        bytes32 indexed planIdentifier,
        bytes32 indexed businessIdentifier,
        address indexed owner
    );

    event UpdatedPlan(
        bytes32 indexed planIdentifier,
        bytes32 indexed businessIdentifier,
        address indexed owner
    );

    event TerminatedPlan(
        bytes32 indexed planIdentifier,
        bytes32 indexed businessIdentifier,
        address indexed owner,
        uint terminationDate
    );

    event CreatedSubscription(
        bytes32 indexed subscriptionIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner
    );

    event LastSubscriptionPaymentDate(
        bytes32 indexed subscriptionIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner,
        uint date
    );

    event UpdatedSubscription(
        bytes32 indexed subscriptionIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner
    );

    event TerminatedSubscription(
        bytes32 indexed subscriptionIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner,
        uint terminationDate
    );

    /**
      * Modifiers
    */
    modifier isOwnerOfPlan(bytes32 _plan) {
        require(msg.sender == plans[_plan].owner);
        _;
    }

    modifier shouldEmitPlanChanges(bytes32 _plan) {
        _;
        emit UpdatedPlan(_plan, plans[_plan].identifier, plans[_plan].owner);
    }

    modifier isOwnerOfSubscription(bytes32 _subscription) {
        require(msg.sender == subscriptions[_subscription].owner);
        _;
    }

    modifier shouldEmitSubscriptionChanges(bytes32 _subscription) {
        _;
        emit UpdatedSubscription(_subscription, subscriptions[_subscription].planHash, subscriptions[_subscription].owner);
    }

    /**
      * EXTERNAL FUNCTIONS
    */
    /** @dev Terminate's the plan in case the merchant wants to discontinue the service.
      * @param _plan is the hash of the user's plan.
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

        emit TerminatedPlan(_plan, plans[_plan].identifier, plans[_plan].owner, _terminationDate);
    }

    /**
      * COLLECTIBLE INTERFACE FUNCTIONS
    */
    function isValidSubscription(bytes32 _subscription)
        public
        view
        returns (bool success)
    {
        // @TODO: Add tests for this.

        return (
            plans[subscriptions[_subscription].planHash].terminationDate == 0 &&
            subscriptions[_subscription].terminationDate == 0 &&
            subscriptions[_subscription].lastPaymentDate > 0
        );
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
        bytes32 planHash = subscriptions[_subscription].planHash;
        return (subscriptions[_subscription].owner, plans[planHash].owner);
    }

    function getSubscriptionInterval(bytes32 _subscription)
        public
        view
        returns (uint interval)
    {
        bytes32 planHash = subscriptions[_subscription].planHash;
        return plans[planHash].interval;
    }

    function getAmountDueFromSubscription(bytes32 _subscription)
        public
        view
        returns (uint amount)
    {
        bytes32 planHash = subscriptions[_subscription].planHash;
        return plans[planHash].amount;
    }

    function getSubscriptionFee(bytes32 _subscription)
        public
        view
        returns (uint fee)
    {
        bytes32 planHash = subscriptions[_subscription].planHash;
        return plans[planHash].fee;
    }

    function getLastSubscriptionPaymentDate(bytes32 _subscription)
        public
        view
        returns (uint date)
    {
        return subscriptions[_subscription].lastPaymentDate;
    }

    function getGasCostForExecution(bytes32 _subscription, uint _type)
        public
        view
        returns (uint gasCost, uint gasPrice)
    {
        return (200000, 2*10**9);
    }

    function setLastPaymentDate(uint _date, bytes32 _subscription)
        public
        onlyAuthorized
    {
        //require(_date >= currentTimestamp());
        require(subscriptions[_subscription].lastPaymentDate <= _date);

        subscriptions[_subscription].lastPaymentDate = _date;

        emit LastSubscriptionPaymentDate(_subscription, subscriptions[_subscription].planHash, subscriptions[_subscription].owner, _date);
    }

    function cancelSubscription(bytes32 _subscription)
        public
    {
        // Either the original subscription owner can cancel or an authorized address.
        require((msg.sender == subscriptions[_subscription].owner) || (authorized[msg.sender] == true));

        // Ensure that the subscription has started;
        require(subscriptions[_subscription].lastPaymentDate > 0);

        // If it hasn't been terminated, do it. Doesn't throw in case the executor calls it without knowing the status.
        if (subscriptions[_subscription].terminationDate == 0) {
            uint cancellationTimestamp = currentTimestamp();
            subscriptions[_subscription].terminationDate = cancellationTimestamp;

            emit TerminatedSubscription(
                _subscription,
                subscriptions[_subscription].planHash,
                subscriptions[_subscription].owner,
                cancellationTimestamp
            );
        }

    }

    /**
      * PUBLIC FUNCTIONS
    */
    constructor(address _approvedRegistryAddress) public {
        approvedRegistry = ApprovedRegistryInterface(_approvedRegistryAddress);
    }

    /** @dev This is the function for creating a new plan.
      * @param _owner the address which owns this contract and to which a payment will be made.
      * @param _tokenAddress the currency they'd like to receive in.
      * @param _identifier a way to uniquely identify a product for each vendor.
      * @param _interval after how many days should a customer be charged.
      * @param _amount how much should the consumer be charged (in wei).
      * @param _fee the fee for processing the subscription (in wei).
      * @param _data any extra data they'd like to store.
    */
    function createPlan(
        address _owner, // Required
        address _tokenAddress, // Required
        bytes32 _identifier, // Required
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
        require(_identifier.length > 0);
        require(_interval > 0);
        require(_amount > 0);
        require(_amount > _fee);
        require(_fee > 0);
        require(approvedRegistry.isTokenAuthorised(_tokenAddress));

        bytes32 planHash = keccak256(
            abi.encodePacked(
                _owner,
                _tokenAddress,
                _identifier,
                _interval,
                _amount,
                _fee,
                _data
            )
        );

        require(plans[planHash].owner == 0x0);

        Plan memory newPlan = Plan({
            owner: _owner,
            tokenAddress: _tokenAddress,
            identifier: _identifier,
            interval: _interval,
            amount: _amount,
            fee: _fee,
            data: _data,
            terminationDate: 0
        });

        plans[planHash] = newPlan;

        emit CreatedPlan(planHash, _identifier, _owner);

        return planHash;
    }

    /** dev This is the function for creating a new subscription.
      * @param _planHash a reference to the subscribed plan
      * @param _data extra data store.
    */
    function createSubscription(
        bytes32 _planHash,
        string _data
    )
        public
        returns (bytes32 newSubscriptionHash)
    {
        // @TODO: Check for overflows and underflows

        require(msg.sender != 0x0);

        address planTokenAddress = plans[_planHash].tokenAddress;

        bytes32 subscriptionHash =
            keccak256(abi.encodePacked(msg.sender, _planHash, currentTimestamp()));

        require(subscriptions[subscriptionHash].owner == 0x0);
        require(planTokenAddress != 0x0);

        Subscription memory newSubscription = Subscription({
            owner: msg.sender,
            tokenAddress: planTokenAddress,
            planHash: _planHash,
            lastPaymentDate: 0,
            terminationDate: 0,
            data: _data
        });

        subscriptions[subscriptionHash] = newSubscription;

        emit CreatedSubscription(subscriptionHash, _planHash, msg.sender);

        return subscriptionHash;
    }

    /** @dev Updates the plan's owner.
      * @param _plan is the hash of the user's plan.
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

    /** @dev Updates the data field which can be used to store anything extra.
      * @param _plan is the hash of the user's plan.
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