const fs = require('fs-extra');
const rimraf = require('rimraf');
const replace = require('replace-in-file');
const path = require('path');

const Web3 = require('aion-web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// The files we finally want at the end
const flattenFiles = [
    'Executor',
    'ApprovedRegistry',
    'PaymentRegistry',
    'StakeContract',
    'MockKyberNetwork',
    'MultiSigWalletWithTimeLock',
    'EightExToken',
    'TransferProxy',
    'VolumeSubscription',
    'PayrollSubscription',
];

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

// Function to flatten output

async function flatten(inputFilePath) {
	const inputFileContent = await fs.readFileSync(inputFilePath, 'utf8')
	let dir = variables.parentDir + '/'
	const isAbsolutePath = !dir.startsWith('.')
	if (!isAbsolutePath) {
		dir = __dirname + '/' + dir
	}
	dir = cleanPath(dir)
	const path = variables.parentDir + '/**/*.sol'
	const srcFiles = await getSourceFiles(dir, path)
	variables.srcFiles = srcFiles
}

async function getSourceFiles(dir, path) {
	return await glob(path)
}

async function replaceImports(inputFileContent, dir) {
	let outputFileContent = await replaceAllImportsRecursively(inputFileContent, dir)
	outputFileContent = removeDoubledSolidityVersion(outputFileContent)
	if (!fs.existsSync(FLAT_DIR)) fs.mkdirSync(FLAT_DIR)
	const fileName = `_flat.sol`
	const filePath = `${FLAT_DIR}/${fileName}`
	fs.writeFileSync(filePath, outputFileContent)
	log.info(`Success! Flat file ${fileName} is generated to  ${FLAT_DIR} directory`)
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

    replaceImports(inputFileContent, dir)

    // const newFile = fs.readFileSync(file.path, "utf8");
    // web3.eth.compileSolidity(newFile).then((res) => {
    //     console.log(res);
    // }); 

    console.log(file);
});
