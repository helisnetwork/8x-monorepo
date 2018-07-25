pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./base/token/ERC20.sol";
import "./base/token/WETH.sol";

import "./Collectable.sol";
import "./TransferProxy.sol";
import "./StakeContract.sol";
import "./PaymentRegistry.sol";
import "./KyberNetworkInterface.sol";

/** @title Contains all the data required for a user's active subscription. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract Executor is Ownable {

    struct GasCost {
        uint callValue;
        uint gasCost;
        uint gasPrice;
    }

    TransferProxy public transferProxy;
    StakeContract public stakeContract;
    PaymentRegistry public paymentRegistry;
    KyberNetworkInterface public kyberProxy;
    WETH public wrappedEther;

    mapping (address => bool) public approvedTokenMapping;
    mapping (address => mapping (uint => GasCost)) public approvedContractMapping;

    address[] public approvedContractArray;
    address[] public approvedTokenArray;

    event LogAuthorizedContractAdded(address indexed target);
    event LogAuthorizedContractRemoved(address indexed target);
    event LogAuthorizedTokenAdded(address indexed target);
    event LogAuthorizedTokenRemoved(address indexed target);

    event SubscriptionActivated(address subscriptionAddress, bytes32 subscriptionIdentifer);
    event SubscriptionProcessesed(address subscriptionAddress, bytes32 subscriptionIdentifer);

    event ContractGasCostSet(address indexed contractAddress, uint indexed index);
    event ContractGasCostRemoved(address indexed contractAddress, uint indexed index);

    uint public currentMultiplier;

    /**
      * MODIFIERS
    */

    modifier isValidSubscriptionContract(address _subscriptionContract) {
        require(approvedContractMapping[_subscriptionContract][0].callValue > 0);
        _;
    }

    /**
      * PUBLIC FUNCTIONS
    */
    /** @dev Set a multiplier for how many tokens you need in order to claim proportional to the payments.
      * @param _multiplier is the multiplier that would like to be set.
    */


    function updateMultiplier(uint _multiplier) public onlyOwner {
        currentMultiplier = _multiplier;
    }

    /** @dev Set the addresses for the relevant contracts
      * @param _transferProxyAddress the address for the designated transfer proxy.
      * @param _stakeContractAddress the address for the stake contract.
      * @param _paymentRegistryAddress the address for the payment registry.
      * @param _wrappedEtherAddress the address for wrapped ether token.
      * @param _kyberAddress the address for the kyber network contract.
    */
    constructor(
        address _transferProxyAddress,
        address _stakeContractAddress,
        address _paymentRegistryAddress,
        address _wrappedEtherAddress,
        address _kyberAddress
    )
        public
    {
        // @TODO: Figure out how to add tests for this

        transferProxy = TransferProxy(_transferProxyAddress);
        stakeContract = StakeContract(_stakeContractAddress);
        paymentRegistry = PaymentRegistry(_paymentRegistryAddress);
        wrappedEther = WETH(_wrappedEtherAddress);
        kyberProxy = KyberNetworkInterface(_kyberAddress);
    }

    /** @dev Add an approved subscription contract to be used.
      * @param _contractAddress is the address of the subscription contract.
    */
    function addApprovedContract(address _contractAddress)
        public
        onlyOwner
    {
        approvedContractArray.push(_contractAddress);
        emit LogAuthorizedContractAdded(_contractAddress);
    }

    /** @dev Set an approved contract call cost.
      * @param _contractAddress is the address of the subscription contract.
      * @param _index is the reference to the call (cancel, subscribe etc).
      * @param _callValue is how much the transaction will cost.
      * @param _gasCost is the amount of gas that will be used.
      * @param _gasPrice is the gas price that will be reimbursed up to.
    */
    function setApprovedContractCallCost(
        address _contractAddress,
        uint _index,
        uint _callValue,
        uint _gasCost,
        uint _gasPrice
    )
        public
        onlyOwner
    {
        bool contractFoundInRegistry = false;

        for (uint i = 0; i < approvedContractArray.length; i++) {
            if (approvedContractArray[i] == _contractAddress) {
                contractFoundInRegistry = true;
                break;
            }
        }

        require(contractFoundInRegistry);

        approvedContractMapping[_contractAddress][_index] = GasCost({
            callValue: _callValue,
            gasCost: _gasCost,
            gasPrice: _gasPrice
        });

        emit ContractGasCostSet(_contractAddress, _index);

    }

    /** @dev Add an approved token to be used.
      * @param _tokenAddress is the address of the token to be used.
    */
    function addApprovedToken(address _tokenAddress)
        public
        onlyOwner
    {
        approvedTokenArray.push(_tokenAddress);
        approvedTokenMapping[_tokenAddress] = true;
        emit LogAuthorizedTokenAdded(_tokenAddress);
    }

    /** @dev Remove an approved subscription contract.
      * @param _contractAddress is the address of the subscription contract.
    */
    function removeApprovedContract(address _contractAddress)
        public
        onlyOwner
    {
        for (uint i = 0; i < approvedContractArray.length; i++) {
            if (approvedContractArray[i] == _contractAddress) {
                approvedContractArray[i] = approvedContractArray[approvedContractArray.length - 1];
                approvedContractArray.length--;

                emit LogAuthorizedContractRemoved(_contractAddress);

                break;
            }
        }
    }

    /** @dev Remove an approved contract call cost.
      * @param _contractAddress is the address of the contract.
      * @param _index is the reference to the call (cancel, subscribe etc).
    */
    function removeApprovedContractCallCost(
        address _contractAddress,
        uint _index
    )
        public
        onlyOwner
    {
        delete approvedContractMapping[_contractAddress][_index];

        emit ContractGasCostRemoved(_contractAddress, _index);
    }

    /** @dev Remove an approved token to be used.
      * @param _tokenAddress is the address of the token to remove.
    */
    function removeApprovedToken(address _tokenAddress)
        public
        onlyOwner
    {
        for (uint i = 0; i < approvedTokenArray.length; i++) {
            if (approvedTokenArray[i] == _tokenAddress) {
                approvedTokenArray[i] = approvedTokenArray[approvedTokenArray.length - 1];
                approvedTokenArray.length--;

                delete approvedTokenMapping[_tokenAddress];

                emit LogAuthorizedTokenRemoved(_tokenAddress);

                break;
            }
        }
    }

    /** @dev Get approved contract array.
    */
    function getApprovedContracts()
        public
        constant
        returns (address[])
    {
        return approvedContractArray;
    }

    /** @dev Get approved token array.
    */
    function getApprovedTokens()
        public
        constant
        returns (address[])
    {
        return approvedTokenArray;
    }

    /** @dev Active a subscription once it's been created (make the first payment) paid from wrapped Ether.
      * @param _subscriptionContract is the contract where the details exist(adheres to Collectible contract interface).
      * @param _subscriptionIdentifier is the identifier of that customer's subscription with its relevant details.
      * @param _useEther flag to determine whether to pay using funds in wrapped ether contract or token.
    */
    function activateSubscription(
        address _subscriptionContract,
        bytes32 _subscriptionIdentifier,
        bool _useEther
    )
        public
        isValidSubscriptionContract(_subscriptionContract)
        returns (bool success)
    {

        // @TODO: Implementation
        // @TODO: Store extra data so gas can be refunded to the person cancelling

        // Initiate an instance of the collectable subscription
        Collectable subscription = Collectable(_subscriptionContract);

        // Check if the subscription is even valid
        require(subscription.isValidSubscription(_subscriptionIdentifier) == false);

        // Check if the token is authorised
        address tokenAddress = subscription.getSubscriptionTokenAddress(_subscriptionIdentifier);
        ERC20 transactingToken = ERC20(tokenAddress);

        require(approvedTokenMapping[tokenAddress]);

        // Check if the user has enough WETH.
        (address consumer, address business) = subscription.getSubscriptionFromToAddresses(_subscriptionIdentifier);
        uint amountDue = subscription.getAmountDueFromSubscription(_subscriptionIdentifier);

        // Get the businesses balance before the transaction
        uint balanceOfBusinessBeforeTransfer = transactingToken.balanceOf(business);

        // Activate payment with Ether or Token
        if (_useEther == true) {
            activatePaymentWithEther(consumer, business, amountDue, tokenAddress);
        } else {
            activatePaymentWithTokens(consumer, business, amountDue, tokenAddress);
        }

        // Check the business actually received the funds by checking the difference
        require((transactingToken.balanceOf(business) - balanceOfBusinessBeforeTransfer) == amountDue);

        // Start the subscription
        subscription.setStartDate(currentTimestamp(), _subscriptionIdentifier);

        // Emit the appropriate event to show subscription has been activated
        emit SubscriptionActivated(_subscriptionContract, _subscriptionIdentifier);
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

    /**
      * PRIVATE FUNCTIONS
    */
    function activatePaymentWithEther(
        address consumer,
        address business,
        uint amountDue,
        address tokenAddress
    )
        private
    {
        // Initialise the token contract
        ERC20 transactingToken = ERC20(tokenAddress);

        // Get the current exchange rate from Kyber, if we can't then Kyber shouldn't let it go through
        (, uint minimumRate) = kyberProxy.getExpectedRate(transactingToken, wrappedEther, amountDue);

        // @TODO: If this is 0 then we have to enable some kind of switch to turn on.
        uint amountToTake = (minimumRate * amountDue) / (10**18);

        require(wrappedEther.balanceOf(consumer) >= amountToTake);

        // Transfer part of the approval given to 8x to Kyber
        transferProxy.transferApproval(
            address(wrappedEther),
            address(transferProxy),
            address(kyberProxy),
            consumer,
            amountToTake
        );

        // Send the ETH to Kyber and set the destination to the business
        kyberProxy.swapTokenToTokenWithChange(
            wrappedEther, // Source token
            amountToTake, // Amount to send (convert)
            transactingToken, // Destination token
            business, // Destination address
            consumer, // User to take ether from and refund change
            amountDue, // Maxmium amount we want after swap
            minimumRate // Minimum conversion rate
        );

    }

    function activatePaymentWithTokens(
        address consumer,
        address business,
        uint amountDue,
        address tokenAddress
    )
        private
    {
        // Initialise the token contract
        ERC20 transactingToken = ERC20(tokenAddress);

        // Check if the user has enough funds
        require(transactingToken.balanceOf(consumer) >= amountDue);

        // Send ETH to the destination business
        transferProxy.transferFrom(tokenAddress, consumer, business, amountDue);
    }

}


/*
   Collectable subscription = Collectable(_subscriptionContract);

        // Ensure the subscription is valid
        require(subscription.isValidSubscription(_subscriptionIdentifier) == false);

        address tokenAddress = subscription.getSubscriptionTokenAddress(_subscriptionIdentifier);

        // Check it's an approved transacting token
        require(approvedTokenMapping[tokenAddress]);

        // Get the amount due for the subscription
        uint amountDue = subscription.getAmountDueFromSubscription(_subscriptionIdentifier);

        // Get the address of the consumer (from) and business (to)
        (address from, address to) = subscription.getSubscriptionFromToAddresses(_subscriptionIdentifier);

        ERC20 transactingTokenContract = ERC20(tokenAddress);

        // Check that the balance of the user is enough to pay for the subscription
        require(transactingTokenContract.balanceOf(from) >= amountDue);

        transferProxy.transferFrom(tokenAddress, from, to, amountDue);
        subscription.setStartDate(currentTimestamp(), _subscriptionIdentifier);

        emit SubscriptionActivated(_subscriptionContract, _subscriptionIdentifier);

*/

/*

 Collectable subscription = Collectable(_subscriptionContract);

        // Ensure the subscription is valid
        require(subscription.isValidSubscription(_subscriptionIdentifier) == false);

        address tokenAddress = subscription.getSubscriptionTokenAddress(_subscriptionIdentifier);

        uint amountDue = subscription.getAmountDueFromSubscription(_subscriptionIdentifier);
        uint fee = subscription.getSubscriptionFee(_subscriptionIdentifier);

        ERC20 transactingTokenContract = ERC20(tokenAddress);

        // @TODO: Implementation

*/