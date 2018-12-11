const fs = require('fs-extra');
const path = require('path');
const PACKAGE = require('../package.json');

const Web3 = require('aion-web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

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

    web3.eth.compileSolidity(loadedFile).then((result) =>  {

        let specificArtifacts = result[name];
        console.log(specificArtifacts);
        let artifact = {
            contractName: name,
            abi: specificArtifacts.info.abiDefinition,
            bytecode: specificArtifacts.code,
            compiler: specificArtifacts.info.compilerVersion,
            version: PACKAGE.version,
            networks: {}
        };

        let prettyArtifact = JSON.stringify(artifact, null, 2);
        fs.writeFileSync(LOCAL_DIR + '/' + name + '.json', prettyArtifact);
        fs.writeFileSync(JSON_DIR + '/' + name + '_Aion.json', prettyArtifact);

        let typescriptAbi = "export const " + name + "_Aion = \n" + prettyArtifact;
        fs.writeFileSync(TS_DIR + '/' + name + '_Aion.ts', typescriptAbi);
        
    }).catch((error) => {
        console.log("Couldn't compile " + name);
        console.log(error);
    })
    
});