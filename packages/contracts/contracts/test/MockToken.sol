pragma solidity 0.4.24;

import "../base/token/StandardToken.sol";
import "../base/ownership/Ownable.sol";

contract MockToken is StandardToken, Ownable {

    uint8 constant public DECIMALS = 18;
    uint256 public totalSupply = 10**27; // 1 billion tokens, 18 decimal places
    string constant public NAME = "Mock Token";
    string constant public SYMBOL = "MOCK";
    uint256 constant public MAX_UINT = 2**256 - 1;

    constructor() public {
        balances[msg.sender] = totalSupply;
    }

}