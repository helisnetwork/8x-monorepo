pragma solidity 0.4.24;

import "../Authorizable.sol";

/** @title Gets details of the subscription and terminates it after detecting insufficient tokens */
/** @author Kerman Kohli - <kerman@8xprotocol.com> */

contract BillableInterface is Authorizable {

    /**
      * PUBLIC VIEW FUNCTIONS
    */

    /** @dev Checks if the subscription is valid.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @return status returns what state the subscription is in. 0 = not ready. 1 = ready. 2 = active. 3 = terminated.
    */
    function getPaymentStatus(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 status);

    /** @dev Gets the token contract address within the subscription.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @return subscriptionTokenAddress is token contract address within the subscription.
    */
    function getPaymentTokenAddress(bytes32 _paymentIdentifier)
        public
        view
        returns (address subscriptionTokenAddress);

    /** @dev Returns the from (customer) and to (business) addresses of a subscription.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @return from is the address where recurring payments are deducted (customer).
      * @return to is the address where recurring payments are sent (business).
    */
    function getPaymentFromToAddresses(bytes32 _paymentIdentifier)
        public
        view
        returns (address from, address to);

    /** @dev Returns the interval for the subscription.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @return interval is the time period denoted in seconds.
    */
    function getPaymentInterval(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 interval);

    /** @dev Gets the token amount due from the subscription.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @return amount is token amount due from the subscription.
    */
    function getAmountDueFromPayment(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 amount);

    /** @dev Gets the subscription fee.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @return fee is the subscription fee.
    */
    function getPaymentFee(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 fee);

    /** @dev Get the last date a payment was made.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
    */
    function getLastPaymentDate(bytes32 _paymentIdentifier)
        public
        view
        returns (uint256 date);

    /** @dev Get the cost for executing the transaction.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @param _type in the case that the gas for another operation is wanted.
    */
    function getGasForExecution(bytes32 _paymentIdentifier, uint256 _type)
        public
        view
        returns (uint256 gasCost, uint256 gasPrice);

    /**
      * PUBLIC FUNCTIONS
    */

    /** @dev Set the last payment date for the subscription.
      * @param _date is the date to set.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
      * @return success mark whether the transaction was successful.
      * @return isFinalPayment is an indicator if this is the final payment.
    */
    function setLastestPaymentDate(uint256 _date, bytes32 _paymentIdentifier)
        public
        returns (bool success, bool isFinalPayment);

    /** @dev Cancel the subscription. User or service node iniated.
      * @param _paymentIdentifier is the identifier of the customer's subscription with its relevant details.
    */
    function cancelPayment(bytes32 _paymentIdentifier)
        public;
}