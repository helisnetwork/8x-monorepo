pragma solidity ^0.4.24;

import "../math/SafeMath.sol";
import "./ERC20.sol";
import "./ExtendedERC20.sol";

contract WETH is ERC20, ExtendedERC20 {

    using SafeMath for uint256;

    uint8 constant public DECIMALS = 18;
    string constant public NAME = "Wrapped Ether";
    string constant public SYMBOL = "WETH";

    mapping (address => uint256)                       public  balances;
    mapping (address => mapping (address => uint256))  public  allowed;

    event Approval(address indexed _from, address indexed guy, uint256 _value);
    event TransferApproval(address indexed _from, address indexed _to, address indexed original, uint256 _value);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Deposit(address indexed _to, uint256 _value);
    event Withdrawal(address indexed _from, uint256 _value);

    function() public payable {
        deposit();
    }

    function deposit() public payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _value) public {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] = balances[msg.sender].sub(_value);
        msg.sender.transfer(_value);
        emit Withdrawal(msg.sender, _value);
    }

    function totalSupply() public view returns (uint256 tokenSupply) {
        return address(this).balance;
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

    function transferApproval(address _from, address _to, address _original, uint256 _value) public returns (bool) {
        allowed[_original][_from] = allowed[_original][_from].sub(_value);
        allowed[_original][_to] = allowed[_original][_to].add(_value);

        emit TransferApproval(_from, _to, _original, _value);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit TransferTokens(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit TransferTokens(_from, _to, _value);
        return true;
    }
}