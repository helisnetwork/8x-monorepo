const Web3 = require('aion-web3')
const web3 = new Web3(new Web3.providers.HttpProvider(""));

// Deploy Transfer Proxy
// Deploy Payment Registry
// Deploy Eight Ex Token
// Deploy Stake Contract
// Deploy Kyber Network  
// Deploy DAI or WETH
// Deploy MultiSig with array of addresses, number of confirmations and time lock period
// Deploy Approved Registry with Kyber
// Deploy Volume Subscroption with Approved Registry
// Deploy Payroll Subscription with Approved Registry
// Add WETH to Approve Registry
// Add Volume + Payroll as Approved Contracts
// Deploy Exeuctor with Transfer Proxy, Stake Contract, Payment Registry, Approved Registry, MAXIMUM_INTERVAL_DIVISOR

// Add All Addresses to Artifacts

// Add Executor as authorised to Approved Registry
// Add Executor as authorised to Stake Contract
// Add Executor as authorised to Payment Registry
// Add Executor as authorised to Volume Sub
// Add Executor as authorised to Payroll Sub

// Transfer Ownership to MultiSig
// Transfer all tokens except one to MultiSig

/*
let transferProxy = await deployer.deploy(TransferProxy);
let paymentRegistry = await deployer.deploy(PaymentRegistry);

let eightExToken = await deployer.deploy(EightExToken);
let stakeContract = await deployer.deploy(StakeContract, eightExToken.address);

let kyberNetworkAddress = Dependencies.KyberNetwork[network] || (await deployer.deploy(MockKyberNetwork)).address;
let daiAddress = Tokens.DAI.addresses[network] || (await deployer.deploy(MockToken)).address;

// Deploy MultiSig with one owner, one confirmation and zero seconds to make a change
// This will be changed to something else once we move past an alpha stage
let multiSig = await deployer.deploy(MultiSigWalletWithTimeLock, [accounts[0]], 1, 0);

// Deploy the Approved Registry with Kyber Network
let approvedRegistry = await deployer.deploy(ApprovedRegistry, kyberNetworkAddress);

// Deploy the Volume Subscription contract with the Approved Registry
let volumeSubscription = await deployer.deploy(VolumeSubscription, approvedRegistry.address);

// Deploy the Payroll Subscription contract with the Approved Registry
let payrollSubscription = await deployer.deploy(PayrollSubscription, approvedRegistry.address);

// Add Dai to the approved token token registry
await approvedRegistry.addApprovedToken(daiAddress, false)

// Add Volume + Payroll Subscription as an approved contract
await approvedRegistry.addApprovedContract(volumeSubscription.address);
await approvedRegistry.addApprovedContract(payrollSubscription.address);

// Deploy the executor contract
let executor = await deployer.deploy(
    Executor,
    transferProxy.address,
    stakeContract.address,
    paymentRegistry.address,
    approvedRegistry.address,
    Constants.MAXIMUM_INTERVAL_DIVISOR
);

 // Add Authorized Addresses

let multiSig = await MultiSigWalletWithTimeLock.deployed();

let approvedRegistry = await ApprovedRegistry.deployed();
let transferProxy = await TransferProxy.deployed();
let stakeContract = await StakeContract.deployed();
let paymentRegistry = await PaymentRegistry.deployed();
let executor = await Executor.deployed();
let volumeSubscription = await VolumeSubscription.deployed();
let payrollSubscription = await PayrollSubscription.deployed();
let eightExToken = await EightExToken.deployed();

await transferProxy.addAuthorizedAddress(executor.address);
await stakeContract.addAuthorizedAddress(executor.address);
await paymentRegistry.addAuthorizedAddress(executor.address);
await volumeSubscription.addAuthorizedAddress(executor.address);
await payrollSubscription.addAuthorizedAddress(executor.address);

// Change ownership

await approvedRegistry.transferOwnership(multiSig.address);
await transferProxy.transferOwnership(multiSig.address);
await stakeContract.transferOwnership(multiSig.address);
await paymentRegistry.transferOwnership(multiSig.address);
await executor.transferOwnership(multiSig.address);
await volumeSubscription.transferOwnership(multiSig.address);
await payrollSubscription.transferOwnership(multiSig.address);

// Leave one token to the person who deployed
//await eightExToken.transfer(multiSig, 2 ** 256 - 2);
await eightExToken.transferOwnership(multiSig.address);

*/