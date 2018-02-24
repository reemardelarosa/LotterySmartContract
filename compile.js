const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contract', 'Lottery.sol');
const file = fs.readFileSync(lotteryPath, 'utf8');

const  lottery =  solc.compile(file, 1).contracts[':Lottery'];

module.exports = lottery;