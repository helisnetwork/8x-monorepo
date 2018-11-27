const fs = require('fs-extra');
const rimraf = require('rimraf');
const replace = require('replace-in-file');
const path = require('path');

const Web3 = require('aion-web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Output of truffle compile
const PARENTS_DIR = './aion';
const CONTRACTS_DIR = './contracts';
const AION_DIR = './aion/contracts';
const FLAT_DIR = './aion/flattened';

fs.emptyDirSync(AION_DIR);
fs.copySync(CONTRACTS_DIR, AION_DIR)

// Copy all the files into the new AION folder
try {

    const options = {
        files: `${AION_DIR}/**`,
        from: /uint256/gi,
        to: 'uint128',
    };
    
    const changes = replace.sync(options);
    console.log('Modified files:', changes.join(', \n'));
} catch (error) {
    console.error('Error occurred:', error);
}

// Function to recursively find all the files
const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
      filelist = fs.statSync(path.join(dir, file)).isDirectory()
        ? walkSync(path.join(dir, file), filelist)
        : filelist.concat({
            name: file,
            path: path.join(dir, file),
            size: fs.statSync(path.join(dir, file)).size,
        });
    });
    return filelist;
}

// Start finding all the files and replace things
const result = walkSync(AION_DIR);

result.forEach((file) => {

    const options = {
        files: file.path,
        from: [
            /constructor/gi,
            /view/gi,
            /pure/gi,
            /emit /gi,
            /(, ".*"\);)/gi,
            `pragma solidity 0.4.24`
        ],
        to: [
            `function ${file.name.replace('.sol', '')}`,
            ``,
            ``,
            ``,
            `);`,
            `pragma solidity 0.4.15`
        ],
    };
    
    const changes = replace.sync(options);
    console.log(file);
});
