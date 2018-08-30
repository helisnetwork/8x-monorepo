// Core + ETH currency contract
const artifacts = [
	'Executor',
	'VolumeSubscription',
	'ApprovedRegistry',
	'ActionProxy',
	'Requirements',
	'PaymentRegistry',
	'StakeContract',
];

const PACKAGE = require('./package.json');
const fs = require('fs');
const assert = require('assert');
var rimraf = require('rimraf');

// Output of truffle compile
const BUILD_DIR = './build/contracts/';

// Output of this script
const EXPORT_DIR = '../migrations/artifacts/'+PACKAGE.version;

rimraf.sync(EXPORT_DIR);
fs.mkdirSync(EXPORT_DIR);

// Checks that the input contracts have been generated
const contractHaveBeenCompiled = fs.readdirSync(BUILD_DIR).find(file => file.includes('.json'));
assert(contractHaveBeenCompiled, `No json compiled file found in ${BUILD_DIR}. Did you run \`truffle compile?\``);

//fs.mkdirSync(EXPORT_DIR);

// Takes the export of `truffle compile` and add and remove some information
// Manually executed
artifacts.forEach(function(name) {
	const artifact = require(BUILD_DIR+name+'.json');

	let artifactExported = {
		contractName: artifact.contractName,
		abi: artifact.abi,
		bytecode: artifact.bytecode,
		compiler: artifact.compiler,
		version: PACKAGE.version,
		networks: {}
	};

	const nameTest = EXPORT_DIR+'/'+name+'.json';
	fs.writeFile(nameTest, JSON.stringify(artifactExported, null, 2), function(err) {
		if(err) {
			return console.log(err);
		}
		console.log(nameTest+' saved!');
	});

});
