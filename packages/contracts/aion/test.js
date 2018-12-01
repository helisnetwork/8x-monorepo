const Web3 = require('aion-web3');
const fs = require('fs');
const web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=2a11723e42314e7886056bc3f2157548"));
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// const account = new Accounts();

let account = web3.eth.accounts.privateKeyToAccount('0xa77abf828e0af71551a439174c31e96f19552247cd1e19b1d6322dd61b3df832e17865bbd3b0490940eea10e34a529881932422cf8a19fe8f85aa8ddfff020e7');

(async() => {
    try {
        let nameSol = fs.readFileSync("./flat/PaymentRegistry_flat.sol", "utf8");
        // Compile the contract
        let compiled = '';
        await web3.eth.compileSolidity(nameSol)
        .then(res => compiled = res)
        .catch(err => console.log(err))

        console.log(nameSol);
        console.log('compiled', compiled);

        // const contractInst = new web3.eth.Contract(compiled.ApprovedRegistry.info.abiDefinition);
        // const deploy = await contractInst.deploy( {data:compiled.ApprovedRegistry.code, arguments: []} ).encodeABI();
        // const deployTx = { gas: 4000000, gasPrice: 10000000000, data: deploy, from: account.address };
        // await web3.eth.accounts.signTransaction( deployTx, account.privateKey ).then( (res) => signedTx = res );

        // console.log(signedTx);
        // await web3.eth.sendSignedTransaction( signedTx.rawTransaction
        //   ).on('receipt', receipt => {
        //      console.log("Receipt received!\ntxHash =", receipt.transactionHash,
        //                  "\ncontractAddress =", receipt.contractAddress);
        //      ctAddress = receipt.contractAddress;
        // });

    } catch (err) {
        console.log(err);
    }
})();

