// Import libraries
const fs = require('fs-extra');
const Web3 = require('aion-web3')

require('dotenv').config({ path: '../../.env' });

// Import compiled contracts
const ApprovedRegistry = fs.readJsonSync("../build/ApprovedRegistry.json");
const EightExToken = fs.readJsonSync("../build/EightExToken.json");
const Executor = fs.readJsonSync("../build/Executor.json");
const MultiSigWalletWithTimeLock = fs.readJsonSync("../build/MultiSigWalletWithTimeLock.json");
const PaymentRegistry = fs.readJsonSync("../build/PaymentRegistry.json");
const PayrollSubscription = fs.readJsonSync("../build/PayrollSubscription.json");
const Stake = fs.readJsonSync("../build/StakeContract.json");
const TransferProxy = fs.readJsonSync("../build/TransferProxy.json");
const WETH = fs.readJsonSync("../build/WETH.json");

// Setup web3

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.AION_NODE_ADDRESS));
let deployerAccount = web3.eth.accounts.privateKeyToAccount(process.env.AION_PRIVATE_KEY);

web3.eth.accounts.wallet.add(deployerAccount);
web3.eth.defaultAccount = deployerAccount.address;
console.log('Account used to deploy:', web3.eth.defaultAccount);

// Contract Instances
const ApprovedRegistryContract = new web3.eth.Contract(ApprovedRegistry.abi);
const EightExTokenContract = new web3.eth.Contract(EightExToken.abi);
const ExecutorContract = new web3.eth.Contract(Executor.abi);
const MultiSigWalletWithTimeLockContract = new web3.eth.Contract(MultiSigWalletWithTimeLock.abi);
const PaymentRegistryContract = new web3.eth.Contract(PaymentRegistry.abi);
const PayrollSubscriptionContract = new web3.eth.Contract(PayrollSubscription.abi);
const StakeContract = new web3.eth.Contract(Stake.abi);
const TransferProxyContract = new web3.eth.Contract(TransferProxy.abi);
const WETHContract = new web3.eth.Contract(WETH.abi);

let file = `${process.cwd()}/../../../artifacts/src/addresses/config.json`;
fs.ensureFileSync(file)
const contractsJson = fs.readJsonSync(file, { throws: false }) || {};

async function startDeployment() {

    // Deploy Transfer Proxy
    let transferProxy = await deploy(TransferProxyContract, TransferProxy.bytecode, null, deployerAccount);
    console.log("Deployed Transfer Proxy");

    // Deploy Payment Registry
    let paymentRegistry = await deploy(PaymentRegistryContract, PaymentRegistry.bytecode, null, deployerAccount);
    console.log("Deployed Payment Registry");

    // Deploy Eight Ex Token
    let eightExToken = await deploy(EightExTokenContract, EightExToken.bytecode, null, deployerAccount);
    console.log("Deployed Eight Ex Token");

    // Deploy Stake Contract
    let stakeContract = await deploy(StakeContract, Stake.bytecode, [eightExToken], deployerAccount);
    console.log("Deployed Stake Contract");

    // Deploy DAI or WAION
    let waion = await deploy(WETHContract, WETH.bytecode, null, deployerAccount);
    console.log("Deployed WAION");

    // Deploy MultiSig with array of addresses, number of confirmations and time lock period
    let multiSig = await deploy(
        MultiSigWalletWithTimeLockContract, 
        MultiSigWalletWithTimeLock.bytecode, 
        [[process.env.AION_FINAL_OWNER], 1, 60*60*24],
        deployerAccount
    );
    console.log("Deployed MultiSig");

    // Deploy Approved Registry with Kyber
    let approvedRegistry = await deploy(ApprovedRegistryContract, ApprovedRegistry.bytecode, [""], deployerAccount);
    console.log("Deployed Approved Registry");

    // Deploy Payroll Subscription with Approved Registry
    let payrollSubscription = await deploy(PayrollSubscriptionContract, PayrollSubscription.bytecode, [approvedRegistry], deployerAccount);
    console.log("Deployed Payroll Subscription");

    // Add WETH to Approve Registry
    await addWAIONToApprovedRegistry(waion, approvedRegistry);
    console.log("Executed WETH Approval");

    // Add Volume + Payroll as Approved Contracts
    await addContractsToApprovedRegistry(payrollSubscription, approvedRegistry);
    console.log("Executed Add Contracts");

    // Deploy Exeuctor with Transfer Proxy, Stake Contract, Payment Registry, Approved Registry, MAXIMUM_INTERVAL_DIVISOR
    let executor = await deploy(
        ExecutorContract,
        Executor.bytecode,
        [transferProxy, stakeContract, paymentRegistry, approvedRegistry, 7],
        deployerAccount
    );
    console.log("Deployed Executor");

    // Add All Addresses to Artifacts
    console.log(`
        Transfer Proxy: ${transferProxy},
        Payment Registry: ${paymentRegistry},
        EightEx Token: ${eightExToken},
        Stake Contract: ${stakeContract},
        WETH: ${waion},
        MultiSig: ${multiSig},
        Approved Registry: ${approvedRegistry},
        Payroll Subscription: ${payrollSubscription},
        Executor: ${executor}
    `);

    // Add Executor as authorised
    await addAuthorizedAddress(TransferProxyContract, transferProxy, executor);
    console.log("Executed Add Authorised - Transfer Proxy");

    await addAuthorizedAddress(StakeContract, stakeContract, executor);
    console.log("Executed Add Authorised - Stake Contract");

    await addAuthorizedAddress(PaymentRegistryContract, paymentRegistry, executor);
    console.log("Executed Add Authorised - Payment Registry");

    await addAuthorizedAddress(PayrollSubscriptionContract, payrollSubscription, executor);
    console.log("Executed Add Authorised - Payroll Subscription");

    await addAuthorizedAddress(WETHContract, waion, executor);
    console.log("Executed Add Authorised - WAION");

    // Set NRG Prices

    await updateNRGPrices((10*10**9).toString(), payrollSubscription);
    console.log("NRG Prices Set");

    // Transfer Ownership to MultiSig
    await transferOwnership(ApprovedRegistryContract, approvedRegistry, multiSig);
    console.log("Executed Transfer Ownership - Approved Registry");

    await transferOwnership(TransferProxyContract, transferProxy, multiSig);
    console.log("Executed Transfer Ownership - Transfer Proxy");

    await transferOwnership(StakeContract, stakeContract, multiSig);
    console.log("Executed Transfer Ownership - Stake Contract");

    await transferOwnership(PaymentRegistryContract, paymentRegistry, multiSig);
    console.log("Executed Transfer Ownership - Payment Registry");

    await transferOwnership(ExecutorContract, executor, multiSig);
    console.log("Executed Transfer Ownership - Executor");

    await transferOwnership(PayrollSubscriptionContract, payrollSubscription, multiSig);
    console.log("Executed Transfer Ownership - Payroll Subscription");

    // Transfer all tokens except one to MultiSig
    // @TODO: Make this the entire supply
    await transferAllTokens(EightExTokenContract, multiSig, parseInt(10000*10**18).toString());
    await transferOwnership(EightExTokenContract, eightExToken, multiSig);
    console.log("Executed Transfer Ownership - Eight Ex Token");


    // Export JSON

    let output = {
        'addresses': [{
                'name': 'Executor',
                'address': executor
            },
            {
                'name': 'PayrollSubscription',
                'address': payrollSubscription
            },
            {
                'name': 'ApprovedRegistry',
                'address': approvedRegistry
            },
            {
                'name': 'TransferProxy',
                'address': transferProxy
            },
            {
                'name': 'PaymentRegistry',
                'address': paymentRegistry
            },
            {
                'name': 'EightExToken',
                'address': eightExToken
            },
            {
                'name': 'WAION',
                'address': waion
            },
            {
                'name': 'StakeContract',
                'address': stakeContract
            },
            {
                'name': 'MultSig',
                'address': multiSig
            }
        ],
        'approvedTokens': [
            {
                'ticker': 'WAION',
                'address': waion,
            }
        ],
        'approvedContracts': [
            {
                'name': 'PayrollSubscription',
                'address': payrollSubscription
            }
        ],
        maximumIntervalDivisor: 5,
    };

    contractsJson[process.env.AION_EXPORT_NETWORK] = output;

    await fs.outputFile(file, JSON.stringify(contractsJson, null, 2));
}

// Deploy a contract

async function deploy(contract, code, arguments) {

    const deployContract = contract.deploy({
        data: code, 
        arguments: arguments
    }).encodeABI();

    return await executeDeployment(deployContract)

}

async function executeDeployment(data) {

    let currentNoncePending = await web3.eth.getTransactionCount(deployerAccount.address, "pending");
    let currentNonce = await web3.eth.getTransactionCount(deployerAccount.address);

    console.log('currentNoncePending ->', currentNoncePending)
    console.log('currentNonce ->', currentNonce)

    const deployTx = {
        gas: 4999999,
        gasPrice: 10000000000,
        gasLimit: 10000000000,
        data: data,
        from: deployerAccount.address,
        nonce: currentNoncePending
    };

    let signedTx = await web3.eth.accounts.signTransaction(deployTx, deployerAccount.privateKey)

    console.log(`Deploying...`);
    
    let txHash;

    try {
        txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('transactionHash', function(hash){
            console.log('prmoise tx hash ->', hash);
        })
        console.log('txHash ->', txHash);
    } catch (error) {
        console.log('General deploy error ->', error)
    }

    return txHash.contractAddress;
}

async function executeTransaction(data, address) {

    let currentNoncePending = await web3.eth.getTransactionCount(deployerAccount.address, "pending");
    // let currentNonce = await web3.eth.getTransactionCount(deployerAccount.address);
    //console.log('Nonces: ', currentNonce, currentNoncePending)

    // Create the transaction object
    var txCallIncrement = {
        from: deployerAccount.address, 
        to: address, 
        gas: 2000000,
        data: data,
        // nonce: currentNoncePending
    };

    // Sign it
    let signedIncrementCall = await web3.eth.accounts.signTransaction(
        txCallIncrement, deployerAccount.privateKey
    )
    // .then((res) => console.log())
    // .catch(err => console.log('error')); 
    //console.log('signedTx ->', txCallIncrement);
    //console.log('rawTransaction', signedIncrementCall);

    let interactionReceipt = await web3.eth.sendSignedTransaction(
        signedIncrementCall.rawTransaction
    ).on('transactionHash', txHash => { 
        console.log('txHash', txHash);
    }).on('receipt',
        receipt => { 
        console.log('receipt', receipt);
    });

    //console.log('interactionReceipt ->', interactionReceipt);
    return interactionReceipt;

}

// Update NRG Prices

async function updateNRGPrices(price, payrollSubscription) {

    const priceData = PayrollSubscriptionContract.methods.setGasPrice((10*10**9).toString()).encodeABI();
    await executeTransaction(priceData, payrollSubscription);

}

// Add WETH to Registry

async function addWAIONToApprovedRegistry(waion, approvedRegistry) {
    
    let data = ApprovedRegistryContract.methods.addApprovedToken(waion, true).encodeABI();
    return executeTransaction(data, approvedRegistry);
}

// Add Approved Contracts

async function addContractsToApprovedRegistry(payrollSubscription, approvedRegistry) {
    let payrollData = ApprovedRegistryContract.methods.addApprovedContract(payrollSubscription).encodeABI();
    let payrollResponse = await executeTransaction(payrollData, approvedRegistry);

    return payrollResponse;
}

// Add Authorised Addresses

async function addAuthorizedAddress(contract, address, executor) {

    let data = contract.methods.addAuthorizedAddress(executor).encodeABI();
    return await executeTransaction(data, address);

}

// Transfer Ownership

async function transferOwnership(contract, address, multiSig) {

    let data = contract.methods.transferOwnership(multiSig).encodeABI();
    return await executeTransaction(data, address);

}

// Transfer All Tokens

async function transferAllTokens(contract, multiSig, address, amount) {

    let data = contract.methods.transfer(multiSig, amount).encodeABI();
    return await executeTransaction(data, address)
}

try {
    startDeployment();
} catch (error) {
    console.log(error);
}