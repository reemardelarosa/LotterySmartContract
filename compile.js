// import dependency
/// path, filesync, solidity compiler
const path = require('path');
const fs = require('fs');
const solc = require('solc');

// resolve path
const lotteryPath = path.resolve(__dirname, 'contract', 'Lottery.sol');
// read file
const lotteryFile = fs.readFileSync(lotteryPath, 'utf8');
// compile using solidity compiler
let compiledContract = solc.compile(lotteryFile,1).contracts[':Lottery'];
// export to be reusable
module.exports = compiledContract;