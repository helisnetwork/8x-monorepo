pragma solidity 0.4.24;

import "./base/token/ERC20.sol";

/** @title Kyber Network interface */

interface KyberNetworkProxyInterface {

    /**
      * PUBLIC VIEW FUNCTIONS
    */

    /** @dev Call this function to obtain the freshest conversion rate of a single token pair.
      * @param src source ERC20 token contract address
      * @param dest destination ERC20 token contract address
      * @param srcQty wei amount of source ERC20 token
    */
    function getExpectedRate(
        ERC20 src,
        ERC20 dest,
        uint srcQty
    )
        public
        view
        returns (uint expectedRate, uint slippageRate);

    function maxGasPrice()
        public
        view
        returns(uint);

    function getUserCapInWei(address user)
        public
        view
        returns(uint);

    function getUserCapInTokenWei(address user, ERC20 token)
        public
        view
        returns(uint);

    function enabled()
        public
        view
        returns(bool);

    function info(bytes32 id)
        public
        view
        returns(uint);

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Swap one token with another token
      * @param srcToken valid token address
      * @param srcQty in token wei
      * @param destToken valid token address
      * @param destAddress where to send swapped tokens to
    */
    function swapTokenToToken (
        ERC20 srcToken,
        uint srcQty,
        ERC20 destToken,
        address destAddress
    )
        public;

}