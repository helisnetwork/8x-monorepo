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

    /**
      * PUBLIC FUNCTIONS
    */
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
        onlyOwner
    {
        // @TODO: Implementation
    }

    /**
      *
    */
    function addApprovedContract(address _contractAddress)
        public
    {
        // @TODO: Implementation
    }

    /**
      *
    */
    function addApprovedToken(address _tokenAddress)
        public
    {
        // @TODO: Implementation
    }

    /**
      *
    */
    function removeApprovedContract(address _contractAddress)
        public
    {
        // @TODO: Implementation
    }

    /**
      *
    */
    function removeApprovedToken(address _tokenAddress)
        public
    {
        // @TODO: Implementation
    }

    /** @dev Collect the payment due from the subscriber.
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
    */
    function collectPayment(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier)
        public
        returns (bool success)
    {
        return false;
    }

}