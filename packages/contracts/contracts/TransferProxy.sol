pragma solidity 0.4.24;

import "./base/token/ERC20.sol";
import "./base/token/ExtendedERC20.sol";
import "./Authorizable.sol";

/** @title TokenTransferProxy - Transfers tokens on behalf of contracts. */
/** @author Originally adapted from 0x: Amir Bandeali - <amir@0xProject.com>, Will Warren - <will@0xProject.com> */

contract TransferProxy is Authorizable {

    /**
     * PUBLIC FUNCTIONS
    */

    /** @dev Calls into ERC20 Token contract, invoking transferFrom.
      * @param _token Address of token to transfer.
      * @param _from Address to transfer token from.
      * @param _to Address to transfer token to.
      * @param _value Amount of token to transfer.
      * @return Success of transfer.
    */

    function transferFrom(
        address _token,
        address _from,
        address _to,
        uint256 _value
    )
        public
        onlyAuthorized
        returns (bool success)
    {
        return ERC20(_token).transferFrom(_from, _to, _value);
    }

    function transferApproval(
        address _token,
        address _from,
        address _to,
        address _original,
        uint256 _value
    )
        public
        returns (bool)
    {
        return ExtendedERC20(_token).transferApproval(_from, _to, _original, _value);
    }

}
