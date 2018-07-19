pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";

import "./Collectable.sol";
import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract Executor is Ownable {

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;

    mapping (address => bool) public approvedContractMapping;
    mapping (address => bool) public approvedTokenMapping;

    address[] public approvedContractArray;
    address[] public approvedTokenArray;

    event LogAuthorizedContractAdded(address indexed target);
    event LogAuthorizedContractRemoved(address indexed target);
    event LogAuthorizedTokenAdded(address indexed target);
    event LogAuthorizedTokenRemoved(address indexed target);

    event SubscriptionActivated(address subscriptionAddress, bytes32 subscriptionIdentifer);
    event SubscriptionProcessesed(address subscriptionAddress, bytes32 subscriptionIdentifer);

    /**
      * PUBLIC FUNCTIONS
    */
        /** @dev Set a multiplier for how many tokens you need in order to claim proportional to the payments.
      * @param _multiplier is the multiplier that would like to be set.
    */

    uint public currentMultiplier;

    function updateMultiplier(uint _multiplier) public onlyOwner {
        currentMultiplier = _multiplier;
    }

    /** @dev Set the addresses for the relevant contracts
      * @param _transferProxyAddress the address for the designated transfer proxy.
      * @param _stakeContractAddress the address for the stake contract.
      * @param _paymentRegistryAddress the address for the payment registry.
    */
    constructor(
        address _transferProxyAddress,
        address _stakeContractAddress,
        address _paymentRegistryAddress
    )
        public
    {
        // @TODO: Implementation
    }

    /** @dev Add an approved subscription contract.
      * @param _contractAddress is the address of the subscription contract.
    */
    function addApprovedContract(address _contractAddress)
        public
    {
        // @TODO: Implementation
    }

    /** @dev Add an approved token to be used.
      * @param _tokenAddress is the address of the token to be used.
    */
    function addApprovedToken(address _tokenAddress)
        public
    {
        // @TODO: Implementation
    }

    /** @dev Remove an approved subscription contract.
      * @param _contractAddress is the address of the subscription contract.
    */
    function removeApprovedContract(address _contractAddress)
        public
    {
        // @TODO: Implementation
    }

    /** @dev Remove an approved token to be used.
      * @param _tokenAddress is the address of the token to remove.
    */
    function removeApprovedToken(address _tokenAddress)
        public
    {
        // @TODO: Implementation
    }

    /** @dev Active a subscription once it's been created (make the first payment).
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function activateSubscription(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
        returns (bool success)
    {

        // @TODO: Implementation

    }

    /** @dev Collect the payment due from the subscriber.
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function collectPayment(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier
    )
        public
        returns (bool success)
    {

        // @TODO: Implementation

    }

}