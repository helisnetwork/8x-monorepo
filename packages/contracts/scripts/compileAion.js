const fs = require('fs-extra');
const path = require('path');
const PACKAGE = require('../package.json');

const Web3 = require('aion-web3')
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=2a11723e42314e7886056bc3f2157548"));
// const web3 = new Web3(new Web3.providers.HttpProvider("http://0.0.0.0:8545"));

const FLAT_DIR = './aion/flat';
const LOCAL_DIR = './aion/build';
const JSON_DIR = '../artifacts/src/build/abi/json-aion';
const TS_DIR = '../artifacts/src/build/abi/ts-aion';

fs.emptyDirSync(JSON_DIR);
fs.ensureDirSync(JSON_DIR);

fs.emptyDirSync(TS_DIR);
fs.ensureDirSync(TS_DIR);

fs.emptyDirSync(LOCAL_DIR);
fs.ensureDirSync(LOCAL_DIR);

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
const result = walkSync(FLAT_DIR);

result.forEach((file) => {

    let loadedFile = fs.readFileSync(file.path, "utf8");
    let name = file.name.replace(".sol", "").replace("_flat", "");

    web3.eth.compileSolidity(loadedFile).then((artifact) =>  {

        fs.writeFileSync(LOCAL_DIR + '/' + name + '.json', JSON.stringify(artifact, null, 2));

        let artifactExported = {
            contractName: name,
            abi: artifact[name].info.abiDefinition,
            bytecode: artifact[name].code,
            compiler: artifact[name].info.compilerVersion,
            version: PACKAGE.version,
            networks: {}
        };

        let json = JSON.stringify(artifactExported, null, 2);
        fs.writeFileSync(JSON_DIR + '/' + name + '_Aion.json', json);

        let typescriptAbi = "export const " + name + " = \n" + json;
        fs.writeFileSync(TS_DIR + '/' + name + '_Aion.ts', typescriptAbi);
    })
    
});