const abi = require('ethereumjs-abi');

module.exports = function(types, values) {
    let computedHash = "0x" + abi.soliditySHA3(types, values).toString('hex');
    return computedHash;
};