const fs = require('fs-extra');
const path = require('path');

const Web3 = require('aion-web3')
const web3 = new Web3(new Web3.providers.HttpProvider("https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=2a11723e42314e7886056bc3f2157548"));

const FLAT_DIR = './aion/flat';
const JSON_DIR = './aion/build';

fs.emptyDirSync(JSON_DIR);
fs.ensureDirSync(JSON_DIR);

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
    web3.eth.compileSolidity(loadedFile).then((res, error) =>  {
        fs.writeFileSync(JSON_DIR + '/' + file.name.replace(".sol", ".json"), JSON.stringify(res, null, 2));
    }).catch((error) => {
        console.log(errror);
    });
    
});