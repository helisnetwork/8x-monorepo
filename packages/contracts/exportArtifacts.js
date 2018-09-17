// Core + ETH currency contract
const artifacts = [
	'Executor',
	'VolumeSubscription',
	'ApprovedRegistry',
	'Requirements',
	'PaymentRegistry',
	'StakeContract',
	'KyberNetworkInterface',
	'MockKyberNetwork',
	'MockToken',
	'MockVolumeSubscription'
];

const PACKAGE = require('./package.json');
const fs = require('fs-extra');
const assert = require('assert');
var rimraf = require('rimraf');

// Output of truffle compile
const BUILD_DIR = './build/contracts/';

// Output of this script
const EXPORT_DIR = '../artifacts/build/abi/';

const JSON_DIR = '../artifacts/build/abi/json/';
const TS_DIR = '../artifacts/build/abi/ts/';

fs.emptyDirSync(EXPORT_DIR);

fs.ensureDirSync(JSON_DIR);
fs.ensureDirSync(TS_DIR);

// Checks that the input contracts have been generated
const contractHaveBeenCompiled = fs.readdirSync(BUILD_DIR).find(file => file.includes('.json'));
assert(contractHaveBeenCompiled, `No json compiled file found in ${BUILD_DIR}. Did you run \`truffle compile?\``);

// Takes the export of `truffle compile` and add and remove some information
// Manually executed
artifacts.forEach(function(name) {
	const artifact = require(BUILD_DIR + name + '.json');

	let artifactExported = {
		contractName: artifact.contractName,
		abi: artifact.abi,
		bytecode: artifact.bytecode,
		compiler: artifact.compiler,
		version: PACKAGE.version,
		networks: {}
	};

	let abiJSON = JSON.stringify(artifactExported, null, 2);
	let typescriptAbi = "export const " + artifact.contractName + " = \n" + abiJSON;

	const jsonPath = JSON_DIR + name + '.json';
	fs.writeFileSync(jsonPath, abiJSON);

	const typeScriptPath = TS_DIR + name + '.ts';
	fs.writeFileSync(typeScriptPath, typescriptAbi);

});

const ADDRESSES_ORIGINAL_DIR = '../artifacts/src/addresses/';
const ADDRESSES_BUILD_DIR = '../artifacts/build/addresses/';

fs.ensureDirSync(ADDRESSES_BUILD_DIR);

const addressFiles = [
	'config',
	'dependencies',
	'tokens'
];

addressFiles.forEach(function(name) {

	const jsonFile = fs.readJSONSync(ADDRESSES_ORIGINAL_DIR + name + '.json');

	const savePath = ADDRESSES_BUILD_DIR + name + '.ts';
	let typescriptAddresses = "export const " + name + " = \n" + JSON.stringify(jsonFile, null, 2);
	fs.writeFileSync(savePath, typescriptAddresses);

});
