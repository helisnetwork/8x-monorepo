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

    modifier onlyStakeOwner(address _staker) {

        // @TODO: Implementation

    }

    /**
      * Public functions
    */

    function slashStake(address _staker, uint amount)
        public
        onlyAuthorized
    {
        
        // @TODO: Implementation

    }
    
    function getAvailableStake(address _staker)
        public
        view
    {

        // @TODO: Implementation

    }

    function withdrawStake(address _staker, uint amount) 
        public
        onlyStakeOwner(_staker) 
    {

        // @TODO: Implementation
        
    }

}