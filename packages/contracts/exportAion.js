const fs = require('fs-extra');
const rimraf = require('rimraf');
const replace = require('replace-in-file');

// Output of truffle compile
const CONTRACTS_DIR = './contracts';
const AION_DIR = './aion/contracts';

fs.emptyDirSync(AION_DIR);
fs.copySync(CONTRACTS_DIR, AION_DIR)

const options = {
    files: `${AION_DIR}/**`,
    from: /uint256/gi,
    to: 'uint128',
  };

try {
  const changes = replace.sync(options);
  console.log('Modified files:', changes.join(', \n'));
} catch (error) {
  console.error('Error occurred:', error);
}