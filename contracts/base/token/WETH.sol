pragma solidity ^0.4.24;

import "./ERC20.sol";

contract WETH is ERC20 {

    uint8 constant public DECIMALS = 18;
    string constant public NAME = "Wrapped Ether";
    string constant public SYMBOL = "WETH";

    mapping (address => uint)                       public  balanceOf;
    mapping (address => mapping (address => uint))  public  allowance;

    event Approval(address indexed source, address indexed guy, uint amount);
    event TransferApproval(address indexed source, address indexed dest, address indexed original, uint amount);
    event Transfer(address indexed source, address indexed destination, uint amount);

    event Deposit(address indexed destination, uint amount);
    event Withdrawal(address indexed source, uint amount);

    function() public payable {
        deposit();
    }

    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        msg.sender.transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function totalSupply() public view returns (uint) {
        return this.balance;
    }

    function approve(address guy, uint amount) public returns (bool) {
        allowance[msg.sender][guy] = amount;
        emit Approval(msg.sender, guy, amount);
        return true;
    }

    function transferApproval(address source, address dest, address original, uint amount) public returns (bool) {
        allowance[original][source] -= amount;
        allowance[original][dest] += amount;

        emit TransferApproval(source, dest, original, amount);
    }

    function transfer(address destination, uint amount) public returns (bool) {
        return transferFrom(msg.sender, destination, amount);
    }

    function transferFrom(address source, address destination, uint amount)
        public
        returns (bool)
    {
        require(balanceOf[source] >= amount);

        if (source != msg.sender && allowance[source][msg.sender] != uint(-1)) {
            require(allowance[source][msg.sender] >= amount);
            allowance[source][msg.sender] -= amount;
        }

        balanceOf[source] -= amount;
        balanceOf[destination] += amount;

        emit Transfer(source, destination, amount);

        return true;
    }
}