pragma solidity ^0.4.3;

/** @title Contains all the metadata required for a subscription plan */

contract Plans {

    struct Plan {

        address owner; // The vendor

        string identifier; // Product indentifier
        string name; // Name of this plan
        string description; // Description of the product

        uint terminationDate; // Epoch time for when the plan is terminated by the vendor. Cannot be modified once set.
        uint interval; // Measured in days (required). Cannot be modified once set.
        uint amount; // Measured in cents (required). Cannot be modified once set.

        string data; // Optional data that a vendor may want to include

    }

    address public owner; // Multi-sig wallet or DAO will be in control of this.

    mapping (bytes32 => Plan) public plans; // A mapping containing all the plans

    event Created(bytes32 identifier);
    event Updated(bytes32 identifier);
    event Terminated(bytes32 identifier, uint terminationDate);

    /**
      * Modifiers
    */

    modifier isOwnerOfContract {
        require(msg.sender == owner);
        _;
    }

    modifier isOwnerOfPlan(bytes32 _plan) {
        require(msg.sender == plans[_plan].owner);
        _;
    }

    modifier shouldEmitChanges(bytes32 _plan) {
        _;
        emit Updated(_plan);
    }

    /**
      * External functions
    */

    /** @dev Terminate's the plan in case the merchant wants to discontinue the service
      * @param _plan is the hash of the user's address + identifier
      * @param _terminationDate is the date from which they would like to terminate the service
    */

    function terminatePlan(bytes32 _plan, uint _terminationDate)
        isOwnerOfPlan(_plan)
        external {
        require(_terminationDate >= block.timestamp);
        require(plans[_plan].terminationDate == 0); // If it's already been set then we don't want it to be modified
        plans[_plan].terminationDate = _terminationDate;
        emit Terminated(_plan, _terminationDate);
    }

    /**
      * Public functions
    */

    /** @dev Constructor function
    */

    function Plans() public {
        owner = msg.sender;
    }

    /** @dev This is the function for creating a new plan
      * @param _owner the address which owns this contract and to which a payment will be made
      * @param _identifier a way to uniquely identify a product for each vendor
      * @param _name a front-end displaying name for the product
      * @param _interval after how many days should a customer be charged
      * @param _amount how much should the consumer be charged (in cents)
    */

    function createPlan(
        address _owner, // Required
        string _identifier, // Required
        string _name,
        string _description,
        uint _interval, // Required
        uint _amount, // Required
        string _data
    )

        public
        returns (bytes32 _newPlanHash)
    {

        require(_owner != 0x0);
        require(bytes(_identifier).length > 0);
        require(_interval > 0);
        require(_amount > 0);

        bytes32 newPlanHash = keccak256(_owner, _identifier);
        require(plans[newPlanHash].owner == 0x0);

        Plan memory newPlan = Plan({
            owner: _owner, 
            identifier: _identifier, 
            name: _name, 
            description: _description, 
            terminationDate: 0,
            interval: _interval,
            amount: _amount,
            data: _data
        });

        plans[newPlanHash] = newPlan;

        emit Created(newPlanHash);

        return newPlanHash;
    }

    /** @dev Updates the owner of the contract itself
      * @param _owner the address which they want to update it to
    */

    function setOwner(address _owner) 
        isOwnerOfContract
        public {
        owner = _owner;
    }

    /** @dev Updates the plan's owner in case they want to receive funds in another address
      * @param _plan is the hash of the user's address + identifier
      * @param _owner the address which they want to update it to
    */

    function setPlanOwner(bytes32 _plan, address _owner) 
        isOwnerOfPlan(_plan)
        shouldEmitChanges(_plan)
        public {
        plans[_plan].owner = _owner;
    }

    /** @dev Updates the name of the product (visible to the user)
      * @param _plan is the hash of the user's address + identifier
      * @param _name the name which they want to update it to
    */

    function setPlanName(bytes32 _plan, string _name) 
        isOwnerOfPlan(_plan)
        shouldEmitChanges(_plan)
        public {
        plans[_plan].name = _name;
    }

    /** @dev Updates the description of the product (visible to the user)
      * @param _plan is the hash of the user's address + identifier
      * @param _description the description which they want to update it to
    */

    function setPlanDescription(bytes32 _plan, string _description) 
        isOwnerOfPlan(_plan)
        shouldEmitChanges(_plan)
        public {
        plans[_plan].description = _description;
    }

    /** @dev Updates the data field which can be used to store anything extra
      * @param _plan is the hash of the user's address + identifier
      * @param _data the data which they want to update it to
    */

    function setPlanData(bytes32 _plan, string _data) 
        isOwnerOfPlan(_plan)
        shouldEmitChanges(_plan)
        public {
        plans[_plan].data = _data;
    }

    /** @dev Retrieve a plan from the plans mapping by providing an identifier
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlan(bytes32 _plan)
        view
        public
        returns (
            address _owner,
            string _identifier,
            string _name,
            string _description,
            uint _terminationDate,
            uint _interval,
            uint _amount,
            string _data
        )
    {
        Plan storage plan = plans[_plan];
        return (
            plan.owner,
            plan.identifier,
            plan.name,
            plan.description,
            plan.terminationDate,
            plan.interval,
            plan.amount,
            plan.data
        );
    }

    /** @dev Get the owner for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanOwner(bytes32 _plan)
        public
        view 
        returns (address _owner) {
        return plans[_plan].owner;
    }

     /** @dev Get the identifier for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanIdentifier(bytes32 _plan)
        public
        view 
        returns (string _identifier) {
        return plans[_plan].identifier;
    }

    /** @dev Get the description for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanDescription(bytes32 _plan)
        public
        view 
        returns (string _description) {
        return plans[_plan].description;
    }

    /** @dev Get the name for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanName(bytes32 _plan)
        public
        view 
        returns (string _name) {
        return plans[_plan].name;
    }

    /** @dev Get the termination date for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanTerminationDate(bytes32 _plan)
        public
        view 
        returns (uint _terminationDate) {
        return plans[_plan].terminationDate;
    }
    
    /** @dev Get the interval for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanInterval(bytes32 _plan)
        public
        view 
        returns (uint _interval) {
        return plans[_plan].interval;
    }

    /** @dev Get the amount for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanAmount(bytes32 _plan)
        public
        view 
        returns (uint _amount) {
        return plans[_plan].amount;
    }

    /** @dev Get the extra data for the plan
      * @param _plan is the hash of the user's address + identifier
    */

    function getPlanData(bytes32 _plan)
        public
        view 
        returns (string _data) {
        return plans[_plan].data;
    }

    /**
      * Internal functions
    */

    /**
      * Private functions
    */

}
