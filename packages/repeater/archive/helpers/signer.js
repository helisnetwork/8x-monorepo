const Tx = require('ethereumjs-tx');
const JSON = require('circular-json');

function signTransaction(web3, contract, contractAddress, unbufferedPrivateKey, contractFunction) {

  var promise = new Promise(function(resolve, reject) {

    const account = web3.eth.accounts.privateKeyToAccount(`0x${unbufferedPrivateKey}`);;
    const privateKey = Buffer.from(unbufferedPrivateKey, 'hex');

    const functionAbi = contractFunction.encodeABI();
    let estimatedGas = "2000000".toString(16);
    let nonce;

    Promise.all([
      web3.eth.getTransactionCount(account.address)
    ]).then((_nonce) => {
      nonce = _nonce.toString(16);
      const txParams = {
        gasPrice: '0x09184e72a000',
        gasLimit: 3000000,
        to: contractAddress,
        data: functionAbi,
        from: account.address,
        nonce: '0x' + nonce
      };

      const tx = new Tx(txParams);
      tx.sign(privateKey);

      const serializedTx = tx.serialize();

      return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
        resolve(receipt);
      })

    }).catch((error) => {
      reject(error);
    })

  });

  return promise;

}

module.exports = signTransaction;