pragma solidity 0.4.24;


/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 {

    function allowance(address _owner, address _spender) public view returns (uint256 availableTokens);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function approve(address _spender, uint256 _value) public returns (bool success);
    function totalSupply() public view returns (uint256 tokenSupply);
    function balanceOf(address _account) public view returns (uint256 balance);
    function transfer(address _to, uint256 _value) public returns (bool success);

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TransferToken(address indexed from, address indexed to, uint256 value);
    
}
