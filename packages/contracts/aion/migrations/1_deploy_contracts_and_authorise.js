// Import libraries
const fs = require('fs-extra');
const Web3 = require('aion-web3')

// Import compiled contracts
const ApprovedRegistry = fs.readJsonSync("../build/ApprovedRegistry.json");
const EightExToken = fs.readJsonSync("../build/EightExToken.json");
const Executor = fs.readJsonSync("../build/Executor.json");
const MultiSigWalletWithTimeLock = fs.readJsonSync("../build/MultiSigWalletWithTimeLock.json");
const PaymentRegistry = fs.readJsonSync("../build/PaymentRegistry.json");
const PayrollSubscription = fs.readJsonSync("../build/PayrollSubscription.json");
const Stake = fs.readJsonSync("../build/StakeContract.json");
const TransferProxy = fs.readJsonSync("../build/TransferProxy.json");
const VolumeSubscription = fs.readJsonSync("../build/VolumeSubscription.json");
const WETH = fs.readJsonSync("../build/WETH.json");

// Setup web3

// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
// Account: 0xa0c80e6f6eef087a089ec3fcda7ba07ce6c35c5c9b3f53a1ba8c4c718d10d39a
// Private Key: 0xcc8aed366b1e045d6aeddec5bfa7c152ff686a723ae3c98e5e6785637b451befe5ece5d4b66d6cf8654bb22b7441883b32544bc76231fee4946477d2aa90ec4f

const web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=69b8c35ca8f54d8ab60831d94f3f4716"));
let deployerAccount = web3.eth.accounts.privateKeyToAccount("0xcc8aed366b1e045d6aeddec5bfa7c152ff686a723ae3c98e5e6785637b451befe5ece5d4b66d6cf8654bb22b7441883b32544bc76231fee4946477d2aa90ec4f");

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
const VolumeSubscriptionContract = new web3.eth.Contract(VolumeSubscription.abi);
const WETHContract = new web3.eth.Contract(WETH.abi);

let file = `${process.cwd()}/../../../artifacts/src/addresses/config.json`;
fs.ensureFileSync(file)
const contractsJson = fs.readJsonSync(file, { throws: false }) || {};

let network = 'mastery-aion'

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

    // Deploy DAI or WETH
    let weth = await deploy(WETHContract, WETH.bytecode, null, deployerAccount);
    console.log("Deployed WETH");

    // Deploy MultiSig with array of addresses, number of confirmations and time lock period
    let multiSig = await deploy(
        MultiSigWalletWithTimeLockContract, 
        MultiSigWalletWithTimeLock.bytecode, 
        [[deployerAccount.address], 1, 0],
        deployerAccount
    );
    console.log("Deployed MultiSig");

    // Deploy Approved Registry with Kyber
    let approvedRegistry = await deploy(ApprovedRegistryContract, ApprovedRegistry.bytecode, [""], deployerAccount);
    console.log("Deployed Approved Registry");

    // Deploy Volume Subscroption with Approved Registry
    let volumeSubscription = await deploy(VolumeSubscriptionContract, VolumeSubscription.bytecode, [approvedRegistry], deployerAccount);
    console.log("Deployed Volume Subscription");

    // Deploy Payroll Subscription with Approved Registry
    let payrollSubscription = await deploy(PayrollSubscriptionContract, PayrollSubscription.bytecode, [approvedRegistry], deployerAccount);
    console.log("Deployed Payroll Subscription");

    // Add WETH to Approve Registry
    await addWETHToApprovedRegistry(weth, approvedRegistry);
    console.log("Executed WETH Approval");

    // Add Volume + Payroll as Approved Contracts
    await addContractsToApprovedRegistry(volumeSubscription, payrollSubscription, approvedRegistry);
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
        WETH: ${weth},
        MultiSig: ${multiSig},
        Approved Registry: ${approvedRegistry},
        Volume Subscription: ${volumeSubscription},
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

    await addAuthorizedAddress(VolumeSubscriptionContract, volumeSubscription, executor);
    console.log("Executed Add Authorised - Volume Subscription");

    await addAuthorizedAddress(PayrollSubscriptionContract, payrollSubscription, executor);
    console.log("Executed Add Authorised - Payroll Subscription");

    await addAuthorizedAddress(WETHContract, weth, executor);
    console.log("Executed Add Authorised - WETH");

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

    await transferOwnership(VolumeSubscriptionContract, volumeSubscription, multiSig);
    console.log("Executed Transfer Ownership - Volume Subscription");

    await transferOwnership(PayrollSubscriptionContract, payrollSubscription, multiSig);
    console.log("Executed Transfer Ownership - Payroll Subscription");

    // Transfer all tokens except one to MultiSig
    // await transferAllTokens(EightExTokenContract, multiSig, 2**128 - 2);
    await transferOwnership(EightExTokenContract, eightExToken, multiSig);
    console.log("Executed Transfer Ownership - Eight Ex Token");


    // Export JSON

    let output = {
        'addresses': [{
                'name': 'Executor',
                'address': executor
            },
            {
                'name': 'VolumeSubscription',
                'address': volumeSubscription
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
                'name': 'WETH',
                'address': weth
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
                'ticker': 'WETH',
                'address': weth,
            }
        ],
        'approvedContracts': [
            {
                'name': 'VolumeSubscription',
                'address': volumeSubscription
            },
            {
                'name': 'PayrollSubscription',
                'address': payrollSubscription
            }
        ],
        maximumIntervalDivisor: 5,
    };

    contractsJson[network] = output;

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

    //console.log('currentNoncePending ->', currentNoncePending)
    //.log('currentNonce ->', currentNonce)

    const deployTx = {
        gas: 4699999,
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
            //console.log('prmoise tx hash ->', hash);
        })

        //console.log('txHash ->', txHash);
    } catch (error) {
        //console.log('General deploy error ->', error)
    }

    return txHash.contractAddress;
}

async function executeTransaction(data, address) {

    let currentNoncePending = await web3.eth.getTransactionCount(deployerAccount.address, "pending");
    let currentNonce = await web3.eth.getTransactionCount(deployerAccount.address);
    //console.log('Nonces: ', currentNonce, currentNoncePending)

    // Create the transaction object
    var txCallIncrement = {
        from: deployerAccount.address, 
        to: address, 
        gas: 2000000,
        data: data
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
      //console.log("txHash", txHash) 
    }).on('receipt',
      receipt => { //console.log("receipt", receipt) 
    });

    //console.log('interactionReceipt ->', interactionReceipt);
    return interactionReceipt;

}

// Add WETH to Registry

async function addWETHToApprovedRegistry(weth, approvedRegistry) {
    
    let data = await ApprovedRegistryContract.methods.addApprovedToken(weth, true).encodeABI();
    return executeTransaction(data, approvedRegistry);
}

// Add Approved Contracts

async function addContractsToApprovedRegistry(volumeSubscription, payrollSubscription, approvedRegistry) {
    
    let approvedRegistryData = ApprovedRegistryContract.methods.addApprovedContract(volumeSubscription).encodeABI();
    let approvedRegistryResponse = await executeTransaction(approvedRegistryData, approvedRegistry);

    let payrollData = ApprovedRegistryContract.methods.addApprovedContract(payrollSubscription).encodeABI();
    let payrollResponse = await executeTransaction(payrollData, approvedRegistry);

    return [approvedRegistryResponse, payrollResponse];
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

try {
    startDeployment();
} catch (error) {
    console.log(error);
}