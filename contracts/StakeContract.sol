pragma solidity ^0.4.18;

import "./Authorizable.sol";

/** @title Stake Contract - processors stake their tokens in this smart contract in order to claim transactions */
/** @author Kerman Kohli - <kerman@TBD.com> */

contract StakeContract is Authorizable {

    mapping (address => uint) totalStaked;
    mapping (address => uint) lockedUpStake;

    address public tokenContract;

    /**
      * Modifiers
    */

    modifier onlyStakeOwner() {

        // @TODO: Implementation
        _;
    }

    /**
      * Public functions
    */

    /** @dev When the processor claims a transaction their tokens are staked.
      * @param _staker is the processors who is staking thier tokens.
      * @param _amount is how much they would like to stake;
    */
    function stakeTokens(address _staker, uint _amount) 
        public
        onlyAuthorized
    {

        // @TODO: Implementation

    }

    /** @dev When the processor executes a transaction their tokens are unstaked.
      * @param _staker is the processors who is staking thier tokens.
      * @param _amount is how much they would like to unstake;
    */   
    function unstakeTokens(address _staker, uint _amount)
        public
        onlyAuthorized
    {

        // @TODO: Implementation

    }

    /** @dev When the processor doesn't execute a transaction they claimed their tokens are slashed.
      * @param _staker is the processors who's tokens need to be slashed.
      * @param _amount is how many tokens need to be slashed.
    */ 
    function slashTokens(address _staker, uint _amount)
        public
        onlyAuthorized
    {
        
        // @TODO: Implementation

    }
    
    /** @dev Check how many tokens the processor has available to stake at this moment.
      * @param _staker is the processor who you would like to return the total available for.
    */ 
    function getAvailableStake(address _staker)
        public
        view
    {

        // @TODO: Implementation

    }

    /** @dev Withdraw your stake from the stake contract.
      * @param _amount is how much you would like to withdraw (that's available)..
    */ 
    function withdrawStake(uint _amount) 
        public
        onlyStakeOwner 
    {

        // @TODO: Implementation
        
    }

}