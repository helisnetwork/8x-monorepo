pragma solidity 0.4.24;

import "./interfaces/ApprovedRegistryInterface.sol";
import "./interfaces/KyberNetworkInterface.sol";
import "./interfaces/BillableInterface.sol";

import "./WETH.sol";

import "./base/math/SafeMath.sol";
import "./base/ownership/Ownable.sol";

/** @title Approved contract, tokens and gas prices. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract ApprovedRegistry is ApprovedRegistryInterface, Ownable {

    using SafeMath for uint256;

    mapping (address => uint256) public approvedTokenMapping; // Exchange rate cache (in case Kyber is down).
    mapping (address => bool) public approvedContractMapping;

    KyberNetworkInterface public kyberProxy;
    WETH public wrappedEther;

    address[] public approvedContractArray;
    address[] public approvedTokenArray;

    event ContractAdded(address indexed target);
    event ContractRemoved(address indexed target);

    event TokenAdded(address indexed target);
    event TokenRemoved(address indexed target);

    event CachedPriceOverwritten(address indexed token, uint256 indexed price);

    /**
      * MODIFIERS
    */

    modifier hasContractBeenApproved(address _contractAddress, bool _expectedResult) {
        require(isContractAuthorised(_contractAddress) == _expectedResult, "The contract should be authorised");
        _;
    }

    modifier hasTokenBeenApproved(address _tokenAddress, bool _expectedResult) {
        require(isTokenAuthorised(_tokenAddress) == _expectedResult, "The token should be authorised");
        _;
    }

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Set the addresses for the relevant contracts
      * @param _kyberAddress the address for the kyber network contract.
    */
    constructor(address _kyberAddress) public {
        // @TODO: Figure out how to add tests for this
        kyberProxy = KyberNetworkInterface(_kyberAddress);
    }

    /** @dev Get exchange rate for token.
      * @param _tokenAddress is the address for the token.
    */
    function getRateFor(address _tokenAddress) public view returns (uint256) {

        // If the token is the native currency, then the exchange rate is 1
        if (_tokenAddress == address(wrappedEther)) {
            return 1*10**18;
        }

        var (, rate) = kyberProxy.getExpectedRate(
            ERC20(_tokenAddress),
            ERC20(0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee),
            10**18
        );

        if (rate > 0) {
            approvedTokenMapping[_tokenAddress] = rate;
            return rate;
        }

        // Gas spike hence return cached value
        uint256 cachedRate = approvedTokenMapping[_tokenAddress];

        if (cachedRate == 0) {
            // Fail safe in case Kyber gives 0
            cachedRate = 66*10**14;
        }

        return cachedRate;
    }

    /** @dev Add an approved subscription contract to be used.
      * @param _contractAddress is the address of the subscription contract.
    */
    function addApprovedContract(address _contractAddress)
        public
        onlyOwner
        hasContractBeenApproved(_contractAddress, false)
    {
        approvedContractArray.push(_contractAddress);
        emit ContractAdded(_contractAddress);
    }

    /** @dev Add an approved token to be used.
      * @param _tokenAddress is the address of the token to be used.
    */
    function addApprovedToken(address _tokenAddress, bool _isWETH)
        public
        onlyOwner
        hasTokenBeenApproved(_tokenAddress, false)
    {
        approvedTokenArray.push(_tokenAddress);

        if (_isWETH == true && address(wrappedEther) == address(0)) {
            wrappedEther = WETH(_tokenAddress);
        }

        emit TokenAdded(_tokenAddress);
    }

    /** @dev Remove an approved subscription contract.
      * @param _contractAddress is the address of the subscription contract.
    */
    function removeApprovedContract(address _contractAddress)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < approvedContractArray.length; i++) {
            if (approvedContractArray[i] == _contractAddress) {
                approvedContractArray[i] = approvedContractArray[approvedContractArray.length - 1];
                approvedContractArray.length--;

                approvedContractMapping[_contractAddress] = false;
                emit ContractRemoved(_contractAddress);

                break;
            }
        }
    }

    /** @dev Remove an approved token to be used.
      * @param _tokenAddress is the address of the token to remove.
    */
    function removeApprovedToken(address _tokenAddress)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < approvedTokenArray.length; i++) {
            if (approvedTokenArray[i] == _tokenAddress) {
                approvedTokenArray[i] = approvedTokenArray[approvedTokenArray.length - 1];
                approvedTokenArray.length--;

                approvedTokenMapping[_tokenAddress] = 0;
                emit TokenRemoved(_tokenAddress);

                break;
            }
        }

        if (_tokenAddress == address(wrappedEther)) {
            delete wrappedEther;
        }
    }

    /** @dev Get approved contract array.
    */
    function getApprovedContracts()
        public
        view
        returns (address[])
    {
        return approvedContractArray;
    }

    /** @dev Get approved token array.
    */
    function getApprovedTokens()
        public
        view
        returns (address[])
    {
        return approvedTokenArray;
    }

    /** @dev Check if a subscription has been authorised.
      * @param _contractAddress is the address of the contract.
    */
    function isContractAuthorised(address _contractAddress) public returns (bool) {
        require(_contractAddress != 0, "A valid contract was not passed");

        bool contractFoundInRegistry = false;

        for (uint256 i = 0; i < approvedContractArray.length; i++) {
            if (approvedContractArray[i] == _contractAddress) {
                contractFoundInRegistry = true;
                break;
            }
        }

        return contractFoundInRegistry;
    }

    /** @dev Check if a token has been authorised.
      * @param _tokenAddress is the address of the token.
    */
    function isTokenAuthorised(address _tokenAddress) public returns (bool) {
        require(_tokenAddress != 0, "An empty token address was passed");

        bool tokenFoundInRegistry = false;

        for (uint256 i = 0; i < approvedTokenArray.length; i++) {
            if (approvedTokenArray[i] == _tokenAddress) {
                tokenFoundInRegistry = true;
                break;
            }
        }

        return tokenFoundInRegistry;
    }

    /** @dev Check if the token is a wrapped asset.
      * @param _tokenAddress is the address of the token.
    */
    function isTokenWrapped(address _tokenAddress) public returns (bool) {
        require(_tokenAddress != 0, "An empty token address was passed");

        return address(_tokenAddress) == address(wrappedEther);
    }

    /** @dev Force overwrite the cached price
      * @param _tokenAddress to set for
      * @param _price to set for
    */
    function forceUpdateCachedPrice(address _tokenAddress, uint256 _price) 
        public
        onlyOwner
    {
        approvedTokenMapping[_tokenAddress] = _price;
        emit CachedPriceOverwritten(_tokenAddress, _price);
    }

}