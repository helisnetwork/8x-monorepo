// Import libraries
const fs = require('fs-extra');
const Web3 = require('aion-web3')

// Import compiled contracts
const ApprovedRegistry = fs.readJsonSync("../build/ApprovedRegistry.json").ApprovedRegistry;
const EightExToken = fs.readJsonSync("../build/EightExToken.json").EightExToken;
const Executor = fs.readJsonSync("../build/Executor.json").Executor;
const MultiSigWalletWithTimeLock = fs.readJsonSync("../build/MultiSigWalletWithTimeLock.json").MultiSigWalletWithTimeLock;
const PaymentRegistry = fs.readJsonSync("../build/PaymentRegistry.json").PaymentRegistry;
const PayrollSubscription = fs.readJsonSync("../build/PayrollSubscription.json").PayrollSubscription;
const Stake = fs.readJsonSync("../build/StakeContract.json").StakeContract;
const TransferProxy = fs.readJsonSync("../build/TransferProxy.json").TransferProxy;
const VolumeSubscription = fs.readJsonSync("../build/VolumeSubscription.json").VolumeSubscription;
const WETH = fs.readJsonSync("../build/WETH.json").WETH;

// Setup web3
// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Account: 0xa0c80e6f6eef087a089ec3fcda7ba07ce6c35c5c9b3f53a1ba8c4c718d10d39a
// Private Key: 0xcc8aed366b1e045d6aeddec5bfa7c152ff686a723ae3c98e5e6785637b451befe5ece5d4b66d6cf8654bb22b7441883b32544bc76231fee4946477d2aa90ec4f
//https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=2a11723e42314e7886056bc3f2157548
const web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=69b8c35ca8f54d8ab60831d94f3f4716"));

let deployerAccount = web3.eth.accounts.privateKeyToAccount("0xcc8aed366b1e045d6aeddec5bfa7c152ff686a723ae3c98e5e6785637b451befe5ece5d4b66d6cf8654bb22b7441883b32544bc76231fee4946477d2aa90ec4f");
web3.eth.accounts.wallet.add(deployerAccount);
web3.eth.defaultAccount = deployerAccount.address;

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
    let stakeContract = await deploy(StakeContract, Stake.code, [eightExToken], deployerAccount);

    // Deploy DAI or WETH
    let weth = await deploy(WETHContract, WETH.code, null, deployerAccount);

    // Deploy MultiSig with array of addresses, number of confirmations and time lock period
    let multiSig = await deploy(
        MultiSigWalletWithTimeLockContract, 
        MultiSigWalletWithTimeLock.code, 
        [[deployerAccount.address], 1, 0],
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

    // let instance = await contract.deploy( {data: code, arguments: arguments} ).send({
    //     from: deployerAccount.address,
    //     gas: 4000000,
    //     gasPrice: 10000000000
    // }, function(error, transactionHash){
    //     console.log(`Callback ${error, transactionHash}`)
    // })
    // .on('error', function(error){ console.log(`Error ${error}`) })
    // .on('transactionHash', (transactionHash) => { 
    //     console.log(`Hash ${transactionHash}`) 
    //     getTransactionReceiptMined(transactionHash, 10).then((res) => {
    //         console.log(res);
    //     }).catch(error => console.log(error));
    // })
    // .on('receipt', function(receipt){
    //     console.log(receipt.contractAddress) // contains the new contract address
    // })
    // .on('confirmation', function(confirmationNumber, receipt){ console.log(`Confirmation ${transactionHash}`)})
    // .then(function(newContractInstance){
    //     console.log(newContractInstance.options.address) // instance with the new contract address
    // });

    // const deploy = contract.deploy( {data: code, arguments: arguments} ).encodeABI();
    // const deployTx = { gas: 4000000, gasPrice: 10000000000, data: deploy, from: deployerAccount.address };

    // let signedTx = await web3.eth.accounts.signTransaction(deployTx, deployerAccount.privateKey)

    // console.log(`Deploying...`);
    
    // let error, txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    // console.log(`Tx Hash: ${JSON.stringify(txHash, null, 2)}...`);

    // let resolved = false;
    // let txReceipt = web3.eth.getTransactionReceipt(txHash).then((result) => {
    //     resolved = true;
    // });

    // while (resolved == false) {
    //     await sleep(10000);
    //     txReceipt = web3.eth.getTransactionReceipt(txHash).then((result) => {
    //         resolved = true;
    //     });
    // }

    // await Promise.resolve(txReceipt);

    // console.log(`Tx Receipt: ${JSON.stringify(txReceipt)}\nAddress: ${txHash.contractAddress}`);

    // return txHash.contractAddress;
}

function getTransactionReceiptMined(txHash, interval) {
    const transactionReceiptAsync = function(resolve, reject) {
        web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

try {
    startDeployment();
} catch (error) {
    console.log(error);
}