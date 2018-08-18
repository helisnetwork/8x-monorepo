pragma solidity 0.4.24;

import "./base/ownership/Ownable.sol";
import "./KyberNetworkInterface.sol";

/** @title Approved contract, tokens and gas prices. */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract ApprovedRegistryInterface is Ownable {

    /** @dev Get the current ETH exchange rate.
      * @param _tokenAddress is the address for the token in question.
      * @return the exchange rate.
    */
    function getRateFor(address _tokenAddress) public returns (uint);

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
    */
    function addApprovedToken(address _tokenAddress) public;

    /** @dev Remove an approved token.
      * @param _tokenAddress is the address of the token.
    */
    function removeApprovedToken(address _tokenAddress) public;

    /** @dev Set the gas costs for executing different contract calls.
      * @param _contractAddress is the address of the contract.
      * @param _index is the index for the type of call (cancel, activate etc).
      * @param _callValue is the maximum gas allowed.
      * @param _gasCost is the amount of gas.
      * @param _gasPrice is the price paid for each gas (gwei).
    */
    function setApprovedContractCallCost(
        address _contractAddress,
        uint _index,
        uint _callValue,
        uint _gasCost,
        uint _gasPrice
    )
        public;

    /** @dev Remove the gas costs added in
      * @param _contractAddress is the address of the contract.
      * @param _index is the index for the type of call (cancel, activate etc).
    */
    function removeApprovedContractCallCost(
        address _contractAddress,
        uint _index
    )
        public;

    /** @dev Check if the contract is authorised.
      * @param _contractAddress is the address of the contract.
    */
    function isContractAuthorised(address _contractAddress) public returns (bool);

     /** @dev Check if the token is authorised.
      * @param _tokenAddress is the address of the token.
    */
    function isTokenAuthorised(address _tokenAddress) public returns (bool);

    event ContractAdded(address indexed target);
    event ContractRemoved(address indexed target);

    event TokenAdded(address indexed target);
    event TokenRemoved(address indexed target);

    event ContractGasCostSet(address indexed contractAddress, uint indexed index);
    event ContractGasCostRemoved(address indexed contractAddress, uint indexed index);
}