pragma solidity ^0.4.21;

import "./base/token/ERC20.sol";
import "./Authorizable.sol";

/** @title TokenTransferProxy - Transfers tokens on behalf of contracts that have been approved via decentralized governance. */
/** @author Amir Bandeali - <amir@0xProject.com>, Will Warren - <will@0xProject.com> */

contract TransferProxy is Authorizable {

    /**
     * Public functions
    */

    /** @dev Calls into ERC20 Token contract, invoking transferFrom.
      * @param token Address of token to transfer.
      * @param from Address to transfer token from.
      * @param to Address to transfer token to.
      * @param value Amount of token to transfer.
      * @return Success of transfer.
    */

    function transferFrom(
        address token,
        address from,
        address to,
        uint value)
        public
        onlyAuthorized
        returns (bool)
    {
        return ERC20(token).transferFrom(from, to, value);
    }
    
}
