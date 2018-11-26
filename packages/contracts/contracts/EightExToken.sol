pragma solidity 0.4.24;

import "./base/token/StandardToken.sol";
import "./base/ownership/Ownable.sol";
import "./base/math/SafeMath.sol";

contract EightExToken is StandardToken, Ownable {

    using SafeMath for uint256;

    uint8 constant public DECIMALS = 18;
    uint256 public totalSupply = 10**27; // 1 billion tokens, 18 decimal places
    string constant public NAME = "8x Protocol Token";
    string constant public SYMBOL = "8X";
    uint256 constant public MAX_UINT = 2**256 - 1;

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
    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
    {
        uint256 allowance = allowed[_from][msg.sender];

        if (balances[_from] >= _value
            && allowance >= _value
            && balances[_to].add(_value) >= balances[_to]
        ) {
            balances[_to] = balances[_to].add(_value);
            balances[_from] = balances[_from].sub(_value);
            if (allowance < MAX_UINT) {
                allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
            }
            emit TransferTokens(_from, _to, _value);
            return true;
        } else {
            return false;
        }
    }
}