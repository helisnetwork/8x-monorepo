pragma solidity ^0.4.24;

import "./ERC20.sol";

contract WETH is ERC20 {

    uint8 constant public DECIMALS = 18;
    string constant public NAME = "Wrapped Ether";
    string constant public SYMBOL = "WETH";

    mapping (address => uint)                       public  balances;
    mapping (address => mapping (address => uint))  public  allowed;

    event Approval(address indexed _from, address indexed guy, uint _value);
    event TransferApproval(address indexed _from, address indexed _to, address indexed original, uint _value);
    event Transfer(address indexed _from, address indexed _to, uint _value);

    event Deposit(address indexed _to, uint _value);
    event Withdrawal(address indexed _from, uint _value);

    function() public payable {
        deposit();
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint _value) public {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        msg.sender.transfer(_value);
        emit Withdrawal(msg.sender, _value);
    }

    function totalSupply() public view returns (uint256 tokenSupply) {
        return this.balance;
    }

    function balanceOf(address _account) public view returns (uint256 balance) {
        return balances[_account];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 availableTokens) {
        return allowed[_owner][_spender];
    }

    function transferApproval(address _from, address _to, address original, uint _value) public returns (bool) {
        allowed[original][_from] -= _value;
        allowed[original][_to] += _value;

        emit TransferApproval(_from, _to, original, _value);
    }

    function transfer(address _to, uint _value) public returns (bool success) {
        return transferFrom(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint _value)
        public
        returns (bool)
    {
        require(balances[_from] >= _value);

        if (_from != msg.sender && allowed[_from][msg.sender] != uint(-1)) {
            require(allowed[_from][msg.sender] >= _value);
            allowed[_from][msg.sender] -= _value;
        }

        balances[_from] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}