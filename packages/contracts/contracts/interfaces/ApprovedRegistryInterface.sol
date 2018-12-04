pragma solidity 0.4.24;

import "./KyberNetworkInterface.sol";

/** @title Approved contract, tokens and gas prices. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

interface ApprovedRegistryInterface {

    /** @dev Get the current ETH exchange rate.
      * @param _tokenAddress is the address for the token in question.
      * @return the exchange rate.
    */
    function getRateFor(address _tokenAddress) public view returns (uint256);

    /** @dev Add an approved contract.
      * @param _contractAddress is the address of the contract.
    */
    function addApprovedContract(address _contractAddress) public;

    /** @dev Remove an approved contract.
      * @param _contractAddress is the address of the contract.
    */
    function removeApprovedContract(address _contractAddress) public;

    /** @dev Add an approved token.
      * @param _tokenAddress is the address of the token.
      * @param _isWETH whether the token is the wrapped ether address.
    */
    function addApprovedToken(address _tokenAddress, bool _isWETH) public;

    /** @dev Remove an approved token.
      * @param _tokenAddress is the address of the token.
    */
    function removeApprovedToken(address _tokenAddress) public;

    /** @dev Check if the contract is authorised.
      * @param _contractAddress is the address of the contract.
    */
    function isContractAuthorised(address _contractAddress) public returns (bool);

    /** @dev Check if the token is authorised.
      * @param _tokenAddress is the address of the token.
    */
    function isTokenAuthorised(address _tokenAddress) public returns (bool);

    /** @dev Check if the token is a wrapped asset.
      * @param _tokenAddress is the address of the token.
    */
    function isTokenWrapped(address _tokenAddress) public returns (bool);

    event ContractAdded(address indexed target);
    event ContractRemoved(address indexed target);

    event TokenAdded(address indexed target);
    event TokenRemoved(address indexed target);

}