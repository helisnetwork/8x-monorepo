import abi from 'ethereumjs-abi';

export default function(types, values) {
    let computedHash = "0x" + abi.soliditySHA3(types, values).toString('hex');
    return computedHash;
};