pragma solidity 0.4.24;

import "../base/token/ERC20.sol";

/** @title Kyber Network interface */

contract KyberNetworkInterface {

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

    /** @dev makes a trade from Ether to token. Sends token to msg sender
      * @param token Destination token
      * @param minConversionRate The minimal conversion rate. If actual rate is lower, trade is canceled.
      * @return amount of actual dest tokens
    **/
    function swapEtherToToken(
        ERC20 token,
        uint minConversionRate
    ) public payable;

    /**
      * @dev Swap an exact number of tokens
      * @param srcToken a valid token address
      * @param srcQty in token wei
      * @param destToken valid token address
      * @param destAddress where to send swap result
      * @param user where to get tokens from and and send change to
      * @param maxDestQty max number of tokens in swap outcome. will be sent to destAddress
      * @param minRate minimum conversion rate for this swap
    */
    function swapTokenToTokenWithChange (
        ERC20 srcToken,
        uint srcQty,
        ERC20 destToken,
        address destAddress,
        address user,
        uint maxDestQty,
        uint minRate
    )
        public;

}