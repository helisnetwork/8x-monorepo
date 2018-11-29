// Core + ETH currency contract
const artifacts = [
    'Executor',
    'VolumeSubscription',
    'PayrollSubscription',
    'ApprovedRegistry',
    'PaymentRegistry',
    'StakeContract',
    'MockKyberNetwork',
    'MockToken',
    'MockVolumeSubscription',
    'MockPayrollSubscription',
    'TransferProxy'
];

const PACKAGE = require('../package.json');
const fs = require('fs-extra');
const assert = require('assert');
const rimraf = require('rimraf');
const mustache = require('mustache');
const path = require('path');

// Output of truffle compile
const BUILD_DIR = './build/contracts/';

// Output of this script
const EXPORT_DIR = '../artifacts/src/build/abi/';

const JSON_DIR = '../artifacts/src/build/abi/json/';
const TS_DIR = '../artifacts/src/build/abi/ts/';

fs.emptyDirSync(JSON_DIR);
fs.emptyDirSync(TS_DIR );

fs.ensureDirSync(JSON_DIR);
fs.ensureDirSync(TS_DIR);

// Checks that the input contracts have been generated
const contractHaveBeenCompiled = fs.readdirSync(BUILD_DIR).find(file => file.includes('.json'));
assert(contractHaveBeenCompiled, `No json compiled file found in ${BUILD_DIR}. Did you run \`truffle compile?\``);

// Takes the export of `truffle compile` and add and remove some information
// Manually executed

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
const result = walkSync(BUILD_DIR);

result
.filter((file) => artifacts.includes(file.name.replace('.json', '')))
.forEach((file) => {

    console.log(file);
    
    let artifact = fs.readJSONSync(file.path);
    let name = file.name.replace('.json', '')
    
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
const ADDRESSES_BUILD_DIR = '../artifacts/src/build/addresses/';

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

var mainReadme = mustache.render(fs.readFileSync('../../readme.mustache').toString(), fs.readJSONSync(ADDRESSES_ORIGINAL_DIR + 'config' + '.json'));
fs.writeFileSync('../../README.md', mainReadme);

var artifactsReadme = mustache.render(fs.readFileSync('../artifacts/readme.mustache').toString(), fs.readJSONSync(ADDRESSES_ORIGINAL_DIR + 'config' + '.json'));
fs.writeFileSync('../artifacts/README.md', artifactsReadme);