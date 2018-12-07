pragma solidity 0.4.24;

import "../interfaces/BillableInterface.sol";
import "../interfaces/ApprovedRegistryInterface.sol";

import "../base/math/SafeMath.sol";
import "../base/ownership/Ownable.sol";

import "../Authorizable.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract VolumeSubscription is Ownable, Authorizable, BillableInterface {

    using SafeMath for uint256;

    struct Plan {

        address owner;
        address tokenAddress;

        bytes32 identifier;

        uint256 interval;
        uint256 amount;
        uint256 fee;

        string data;
        uint256 terminationDate;

    }

    struct Subscription {

        address owner;
        address tokenAddress;

        bytes32 planHash;

        uint256 lastPaymentDate;
        uint256 terminationDate;

        string data;
    }

    ApprovedRegistryInterface public approvedRegistry;

    mapping (bytes32 => Plan) public plans;
    mapping (bytes32 => Subscription) public subscriptions;

    uint256 public gasPrice = 3*10**9;
    uint256 public gasCost = 200000;

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
        uint256 terminationDate
    );

    event CreatedSubscription(
        bytes32 indexed paymentIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner
    );

    event LastSubscriptionPaymentDate(
        bytes32 indexed paymentIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner,
        uint256 date
    );

    event UpdatedSubscription(
        bytes32 indexed paymentIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner
    );

    event TerminatedSubscription(
        bytes32 indexed paymentIdentifier,
        bytes32 indexed planIdentifier,
        address indexed owner,
        uint256 terminationDate
    );

    /**
      * Modifiers
    */
    modifier isOwnerOfPlan(bytes32 _plan) {
        require(msg.sender == plans[_plan].owner, "You must be the owner of a plan");
        _;
    }

    modifier shouldEmitPlanChanges(bytes32 _plan) {
        _;
        emit UpdatedPlan(_plan, plans[_plan].identifier, plans[_plan].owner);
    }

    modifier isOwnerOfSubscription(bytes32 _paymentIdentifier) {
        require(msg.sender == subscriptions[_paymentIdentifier].owner, "You must be the owner of the subscription");
        _;
    }

    modifier shouldEmitSubscriptionChanges(bytes32 _paymentIdentifier) {
        _;
        emit UpdatedSubscription(_paymentIdentifier, subscriptions[_paymentIdentifier].planHash, subscriptions[_paymentIdentifier].owner);
    }

    /**
      * EXTERNAL FUNCTIONS
    */
    /** @dev Terminate's the plan in case the merchant wants to discontinue the service.
      * @param _plan is the hash of the user's plan.
      * @param _terminationDate is the date from which they would like to
      * terminate the service.
    */
    function terminatePlan(bytes32 _plan, uint256 _terminationDate)
        external
        isOwnerOfPlan(_plan)
    {
        require(_terminationDate >= currentTimestamp(), "The termination date must be greater than now");

        // If it's already been set then we don't want it to be modified.
        require(plans[_plan].terminationDate == 0, "You cannot modify an already terminated plan");

        plans[_plan].terminationDate = _terminationDate;

        emit TerminatedPlan(_plan, plans[_plan].identifier, plans[_plan].owner, _terminationDate);
    }

    /**
      * BILLABLE INTERFACE FUNCTIONS
    */
    function getPaymentStatus(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 status)
    {
        Subscription memory subscription = subscriptions[_paymentIdentifier];

        if (plans[subscription.planHash].terminationDate > 0 || subscription.terminationDate > 0) {
            // Payment terminated
            return 3;
        }

        if (subscription.lastPaymentDate > 0) {
            // Payment active
            return 2;
        }

        // Payment ready to be started
        return 1;
    }

    function getPaymentTokenAddress(bytes32 _paymentIdentifier)
        public
        view
        returns (address subscriptionTokenAddress)
    {
        return subscriptions[_paymentIdentifier].tokenAddress;
    }

    function getPaymentFromToAddresses(bytes32 _paymentIdentifier)
        public
        view
        returns (address from, address to)
    {
        bytes32 planHash = subscriptions[_paymentIdentifier].planHash;
        return (subscriptions[_paymentIdentifier].owner, plans[planHash].owner);
    }

    function getPaymentInterval(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 interval)
    {
        bytes32 planHash = subscriptions[_paymentIdentifier].planHash;
        return plans[planHash].interval;
    }

    function getAmountDueFromPayment(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 amount)
    {
        bytes32 planHash = subscriptions[_paymentIdentifier].planHash;
        return plans[planHash].amount;
    }

    function getPaymentFee(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 fee)
    {
        bytes32 planHash = subscriptions[_paymentIdentifier].planHash;
        return plans[planHash].fee;
    }

    function getLastPaymentDate(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 date)
    {
        return subscriptions[_paymentIdentifier].lastPaymentDate;
    }

    function getGasForExecution(bytes32 _paymentIdentifier, uint256 _type)
        public
        view
        returns (uint256 returnedGasCost, uint256 returnedGasPrice)
    {
        return (gasCost, gasPrice);
    }

    function setLastestPaymentDate(uint256 _date, bytes32 _paymentIdentifier)
        public
        onlyAuthorized
        returns (bool success, bool isFinalPayment)
    {
        require(subscriptions[_paymentIdentifier].lastPaymentDate <= _date, "The new date must be greater than the old date");

        subscriptions[_paymentIdentifier].lastPaymentDate = _date;

        emit LastSubscriptionPaymentDate(_paymentIdentifier, subscriptions[_paymentIdentifier].planHash, subscriptions[_paymentIdentifier].owner, _date);

        return (true, false);
    }

    function cancelPayment(bytes32 _paymentIdentifier)
        public
    {
        // Either the original subscription owner can cancel or an authorized address.
        require((msg.sender == subscriptions[_paymentIdentifier].owner) || (authorized[msg.sender] == true), "Must be the owner or an authorized address");

        // If it hasn't been terminated, do it. Doesn't throw in case the executor calls it without knowing the status.
        if (subscriptions[_paymentIdentifier].terminationDate == 0) {
            uint256 cancellationTimestamp = currentTimestamp();
            subscriptions[_paymentIdentifier].terminationDate = cancellationTimestamp;

            emit TerminatedSubscription(
                _paymentIdentifier,
                subscriptions[_paymentIdentifier].planHash,
                subscriptions[_paymentIdentifier].owner,
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

    /** @dev Update the gas price for processing a subscription.
      * @param _gasPrice price to set.
    */
    function setGasPrice(uint256 _gasPrice) public onlyOwner {
        gasPrice = _gasPrice;
    }

    /** @dev Update the gas cost for processing a subscription.
      * @param _gasCost cost to set.
    */
    function setGasCost(uint256 _gasCost) public onlyOwner {
        gasCost = _gasCost;
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
        uint256 _interval, // Required
        uint256 _amount, // Required
        uint256 _fee, // Required
        string _data
    )
        public
    {

        require(_owner != 0x0, "Owner cannot be empty");
        require(_tokenAddress != 0x0, "Token cannot be empty");
        require(_identifier.length > 0, "Identifier cannot be empty");
        require(_interval > 0, "Interval cannot be 0");
        require(_amount > 0, "Amount cannot be 0");
        require(_amount > _fee, "Amount must be greater than the fee");
        require(_fee > 0, "Fee cannot be zero");
        require(approvedRegistry.isTokenAuthorised(_tokenAddress), "It must be an authorised token");

        bytes32 planHash = keccak256(
            _owner,
            _tokenAddress,
            _identifier,
            _interval,
            _amount,
            _fee,
            _data
        );

        require(plans[planHash].owner == 0x0, "Cannot overwrite a plan");

        plans[planHash] = Plan({
            owner: _owner,
            tokenAddress: _tokenAddress,
            identifier: _identifier,
            interval: _interval,
            amount: _amount,
            fee: _fee,
            data: _data,
            terminationDate: 0
        });

        emit CreatedPlan(planHash, _identifier, _owner);
    }

    /** @dev This is the function for creating a new subscription.
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
        return createSubscriptionWithSalt(_planHash, _data, currentTimestamp());
    }

    /** @dev Create a subscription and call another contract/function
      * @param _planHash a reference to the subscribed plan
      * @param _data extra data store.
      * @param _callbackAddress the address to call afterwards
      * @param _callbackFunction string of the callback function (eg. 'activate(address,bytes32)')
    */
    function createSubscriptionAndCall(
        bytes32 _planHash, 
        string _data, 
        uint256 _salt,
        address _callbackAddress,
        string _callbackFunction
    ) public {
        bytes32 subscriptionHash = createSubscriptionWithSalt(_planHash, _data, _salt);
        bool result = _callbackAddress.call(
            bytes4(
                keccak256(_callbackFunction)
            ),
            address(this),
            subscriptionHash,
            msg.sender
        );

        require(result, "Could not activate subscription");
    }

     /** @dev This is the function for creating a new subscription with supplied entropy.
      * @param _planHash a reference to the subscribed plan
      * @param _data extra data store.
      * @param _salt entropy to create hash for subscription hash.
    */
    function createSubscriptionWithSalt(
        bytes32 _planHash,
        string _data,
        uint256 _salt
    ) 
        public
        returns (bytes32 newSubscriptionHash)
    {
        // @TODO: Check for overflows and underflows

        require(msg.sender != 0x0, "Must have a sender");

        address planTokenAddress = plans[_planHash].tokenAddress;

        
        bytes32 subscriptionHash = keccak256(
            msg.sender, 
            _planHash, 
            _salt
        );

        require(subscriptions[subscriptionHash].owner == 0x0, "Cannot have a plan with the same hash");
        require(planTokenAddress != 0x0, "Must have a valid token specified");

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
      * @param _paymentIdentifier is the hash of the user's address + identifier.
      * @param _data the data which they want to update it to.
    */
    function setSubscriptionData(bytes32 _paymentIdentifier, string _data)
        public
        isOwnerOfSubscription(_paymentIdentifier)
        shouldEmitSubscriptionChanges(_paymentIdentifier)
    {
        subscriptions[_paymentIdentifier].data = _data;
    }

    /**
      * INTERNAL FUNCTIONS
    */
    /** @dev Current timestamp returned via a function in order for mocks in tests
    */
    function currentTimestamp()
        internal
        view
        returns (uint256 timetstamp)
    {
        // solhint-disable-next-line
        return block.timestamp;
    }

}