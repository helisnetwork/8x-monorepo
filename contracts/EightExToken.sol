pragma solidity 0.4.24;

import "./base/token/StandardToken.sol";
import "./base/ownership/Ownable.sol";


contract EightExToken is StandardToken, Ownable {

    uint8 constant public DECIMALS = 18;
    uint public totalSupply = 10**27; // 1 billion tokens, 18 decimal places
    string constant public NAME = "8x Protocol Token";
    string constant public SYMBOL = "8X";
    uint constant public MAX_UINT = 2**256 - 1;

    constructor() public {
        balances[msg.sender] = totalSupply;
    }

    /** @dev ERC20 transferFrom, modified such that an allowance of MAX_UINT
      * represents an unlimited allowance.
      *
      * @param _from Address to transfer from.
      * @param _to Address to transfer to.
      * @param _value Amount to transfer.
      *
      * @return Success of transfer.
    */
    function transferFrom(address _from, address _to, uint _value)
        public
        returns (bool success)
    {
        uint allowance = allowed[_from][msg.sender];

        if (balances[_from] >= _value
            && allowance >= _value
            && balances[_to] + _value >= balances[_to]
        ) {
            balances[_to] += _value;
            balances[_from] -= _value;
            if (allowance < MAX_UINT) {
                allowed[_from][msg.sender] -= _value;
            }
            emit TransferToken(_from, _to, _value);
            return true;
        } else {
            return false;
        }
    }
}