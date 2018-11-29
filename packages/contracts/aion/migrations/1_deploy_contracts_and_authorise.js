// Import libraries
const fs = require('fs-extra');
const Web3 = require('aion-web3')

// Import compiled contracts
const ApprovedRegistry = fs.readFileSync("../flat/ApprovedRegistry_flat.sol", "utf8");
const EightExToken = fs.readFileSync("../flat/EightExToken_flat.sol", "utf8");
const Executor = fs.readFileSync("../flat/Executor_flat.sol", "utf8");
const MultiSigWalletWithTimeLock = fs.readFileSync("../flat/MultiSigWalletWithTimeLock_flat.sol", "utf8");
const PaymentRegistry = fs.readFileSync("../flat/PaymentRegistry_flat.sol", "utf8");
const PayrollSubscription = fs.readFileSync("../flat/PayrollSubscription_flat.sol", "utf8");
const Stake = fs.readFileSync("../flat/StakeContract_flat.sol", "utf8");
const TransferProxy = fs.readFileSync("../flat/TransferProxy_flat.sol", "utf8");
const VolumeSubscription = fs.readFileSync("../flat/VolumeSubscription_flat.sol", "utf8");
const WETH = fs.readFileSync("../flat/WETH_flat.sol", "utf8");

// Setup web3
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
let deployerAccount;

// Contract Instances
const ApprovedRegistryContract = new web3.eth.Contract(ApprovedRegistry.info.abiDefinition);
const EightExTokenContract = new web3.eth.Contract(EightExToken.info.abiDefinition);
const ExecutorContract = new web3.eth.Contract(Executor.info.abiDefinition);
const MultiSigWalletWithTimeLockContract = new web3.eth.Contract(MultiSigWalletWithTimeLock.info.abiDefinition);
const PaymentRegistryContract = new web3.eth.Contract(PaymentRegistry.info.abiDefinition);
const PayrollSubscriptionContract = new web3.eth.Contract(PayrollSubscription.info.abiDefinition);
const StakeContract = new web3.eth.Contract(Stake.info.abiDefinition);
const TransferProxyContract = new web3.eth.Contract(TransferProxy.info.abiDefinition);
const VolumeSubscriptionContract = new web3.eth.Contract(VolumeSubscription.info.abiDefinition);
const WETHContract = new web3.eth.Contract(WETH.info.abiDefinition);

async function startDeployment() {

    // Deploy Transfer Proxy
    let transferProxy = await deploy(TransferProxyContract, TransferProxy.code, null, deployerAccount);

    // Deploy Payment Registry
    let paymentRegistry = await deploy(PaymentRegistryContract, PaymentRegistry.code, null, deployerAccount);

    // Deploy Eight Ex Token
    let eightExToken = await deploy(EightExTokenContract, EightExToken.code, null, deployerAccount);

    // Deploy Stake Contract
    let stakeContract = await deploy(StakeContract, Stake.code, null, deployerAccount);

    // Deploy DAI or WETH
    let weth = await deploy(WETHContract, WETH.code, null, deployerAccount);

    // Deploy MultiSig with array of addresses, number of confirmations and time lock period
    let multiSig = await deploy(
        MultiSigWalletWithTimeLockContract, 
        MultiSigWalletWithTimeLock.code, 
        [[account.address], 1, 0],
        deployerAccount
    );

    // Deploy Approved Registry with Kyber
    let approvedRegistry = await deploy(ApprovedRegistryContract, ApprovedRegistry.code, null, deployerAccount);

    // Deploy Volume Subscroption with Approved Registry
    let volumeSubscription = await deploy(VolumeSubscriptionContract, VolumeSubscription.code, [approvedRegistry], deployerAccount);

    // Deploy Payroll Subscription with Approved Registry
    let payrollSubscription = await deploy(PayrollSubscriptionContract, PayrollSubscription.code, [approvedRegistry], deployerAccount);

    // Add WETH to Approve Registry
    await addWETHToApprovedRegistry(weth);
    
    // Add Volume + Payroll as Approved Contracts
    await addContractsToApprovedRegistry(volumeSubscription, payrollSubscription);

    // Deploy Exeuctor with Transfer Proxy, Stake Contract, Payment Registry, Approved Registry, MAXIMUM_INTERVAL_DIVISOR
    let executor = await deploy(
        ExecutorContract,
        Executor.code,
        [transferProxy, stakeContract, paymentRegistry, approvedRegistry, 7],
        deployerAccount
    );

    // Add All Addresses to Artifacts
    console.log(`
        Transfer Proxy: ${transferProxy},
        Payment Registry: ${paymentRegistry},
        EightEx Token: ${eightExToken},
        Stake Contract: ${stakeContract},
        WETH: ${weth},
        MultiSig: ${multiSig},
        Approved Registry: ${approvedRegistry},
        Volume Subscription: ${volumeSubscription},
        Payroll Subscription: ${payrollSubscription},
        Executor: ${executor}
    `);

    // Add Executor as authorised
    await addAuthorizedAddress(TransferProxyContract, executor);
    await addAuthorizedAddress(StakeContract, executor);
    await addAuthorizedAddress(PaymentRegistryContract, executor);
    await addAuthorizedAddress(VolumeSubscriptionContract, executor);
    await addAuthorizedAddress(PayrollSubscriptionContract, executor);

    // Transfer Ownership to MultiSig
    await transferOwnership(ApprovedRegistryContract, multiSig);
    await transferOwnership(TransferProxyContract, multiSig);
    await transferOwnership(StakeContract, multiSig);
    await transferOwnership(PaymentRegistryContract, multiSig);
    await transferOwnership(ExecutorContract, multiSig);
    await transferOwnership(VolumeSubscriptionContract, multiSig);
    await transferOwnership(PayrollSubscriptionContract, multiSig);

    // Transfer all tokens except one to MultiSig
    await transferAllTokens(EightExTokenContract, multiSig, 2**128 - 2);
    await transferOwnership(EightExTokenContract, multiSig);

}

// Deploy a contract

async function deploy(contract, code, arguments) {
    const deploy = contract.deploy({
        data: code, 
        arguments: arguments
    }).encodeABI();

    const deployTx = { gas: 40000000, gasPrice: 10000000000, data: deploy, from: account.address };

    let txHash = await web3.eth.accounts.signTransaction(deployTx, account.privateKey);

    let contractAccount = response.address;
    console.log("\ntransaction hash:\n\t" + txHash + "\ncontract address:\n\t" + contractAccount);

    let txReceipt = web3.eth.getTransactionReceipt(txHash);
    
    while (txReceipt == null) {
        sleep(10000);
        txReceipt = web3.eth.getTransactionReceipt(txHash);
    }

    console.log(txReceipt.contractAddress);
    return txReceipt.contractAddress;
}

// Add WETH to Registry

async function addWETHToApprovedRegistry(wethAddress) {

    let response = ApprovedRegistryContract.addApprovedToken(wethAddress, true, {from: ownerAddress, gas: 2000000, gasPrice: 10000000000});
    console.log("Response: " + response);
    // get & print receipt
    let txReceipt = web3.eth.getTransactionReceipt(rsp);
    // repeat till tx processed
    while (txReceipt == null) {
        // wait 10 sec
        sleep(10000);
        txReceipt = web3.eth.getTransactionReceipt(rsp);
    }

    return txReceipt;
}

// Add Approved Contracts

async function addContractsToApprovedRegistry(volumeSubscription, payrollSubscription) {
    
    let responseVolume = ApprovedRegistryContract.addApprovedContract(volumeSubscription, {from: ownerAddress, gas: 2000000, gasPrice: 10000000000});
    console.log("Response: " + responseVolume);
    // get & print receipt
    let txReceiptVolumeSub = web3.eth.getTransactionReceipt(responseVolume);
    // repeat till tx processed
    while (txReceiptVolumeSub == null) {
        // wait 10 sec
        sleep(10000);
        txReceiptVolumeSub = web3.eth.getTransactionReceipt(responseVolume);
    }

    let responsePayroll = ApprovedRegistryContract.addApprovedContract(payrollSubscription, {from: ownerAddress, gas: 2000000, gasPrice: 10000000000});
    console.log("Response: " + responsePayroll);
    // get & print receipt
    let txReceiptPayrollSub = web3.eth.getTransactionReceipt(responsePayroll);
    // repeat till tx processed
    while (txReceiptPayrollSub == null) {
        // wait 10 sec
        sleep(10000);
        txReceiptPayrollSub = web3.eth.getTransactionReceipt(responsePayroll);
    }

    return [txReceiptVolumeSub, txReceiptPayrollSub];
}

// Add Authorised Addresses

async function addAuthorizedAddress(contract, executor) {

    let response = contract.addAuthorizedAddress(executor, {from: ownerAddress, gas: 2000000, gasPrice: 10000000000});
    console.log("Response: " + response);
    // get & print receipt
    let txReceipt = web3.eth.getTransactionReceipt(rsp);
    // repeat till tx processed
    while (txReceipt == null) {
        // wait 10 sec
        sleep(10000);
        txReceipt = web3.eth.getTransactionReceipt(rsp);
    }

    return txReceipt;

}

// Transfer Ownership

async function transferOwnership(contract, multiSig) {

    let response = contract.transferOwnership(multiSig, {from: ownerAddress, gas: 2000000, gasPrice: 10000000000});
    console.log("Response: " + response);
    // get & print receipt
    let txReceipt = web3.eth.getTransactionReceipt(rsp);
    // repeat till tx processed
    while (txReceipt == null) {
        // wait 10 sec
        sleep(10000);
        txReceipt = web3.eth.getTransactionReceipt(rsp);
    }

    return txReceipt;

}

// Transfer All Tokens

async function transferAllTokens(contract, multiSig, amount) {
    let response = contract.transfer(multiSig, amount, {from: ownerAddress, gas: 2000000, gasPrice: 10000000000});
    console.log("Response: " + response);
    // get & print receipt
    let txReceipt = web3.eth.getTransactionReceipt(rsp);
    // repeat till tx processed
    while (txReceipt == null) {
        // wait 10 sec
        sleep(10000);
        txReceipt = web3.eth.getTransactionReceipt(rsp);
    }

    return txReceipt;
}

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