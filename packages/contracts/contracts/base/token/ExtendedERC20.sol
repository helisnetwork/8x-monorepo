pragma solidity 0.4.24;


/**
 * @title Extended ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/
 */
contract ExtendedERC20 {

    function transferApproval(
        address _from,
        address _to,
        address _original,
        uint256 _value
    )
        public
        returns (bool);

    event TransferApproval(
        address indexed _from,
        address indexed _to,
        address indexed original,
        uint256 _value
    );

}
