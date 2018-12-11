const fs = require('fs-extra');
const rimraf = require('rimraf');
const replace = require('replace-in-file');
const path = require('path');

// Output of truffle compile
const PARENTS_DIR = '../aion';
const CONTRACTS_DIR = './contracts';
const AION_DIR = './aion/contracts';

// Copy all the files into the new AION folder
fs.emptyDirSync(AION_DIR);
fs.copySync(CONTRACTS_DIR, AION_DIR)

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
            /uint256/gi,
            /constructor/gi,
            /view/gi,
            /pure/gi,
            /emit /gi,
            /(, ".*"\);)/gi,
            `0.4.24`,
            `2**256`,
            /keccak256/gi,
            /indexed/gi
        ],
        to: [
            `uint128`,
            `function ${file.name.replace('.sol', '')}`,
            ``,
            ``,
            ``,
            `);`,
            `0.4.15`,
            `2**128`,
            `blake2b256`,
            ``
        ],
    };
    
    const changes = replace.sync(options);

    console.log(file);
});
