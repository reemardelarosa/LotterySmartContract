const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contract', 'lottery.sol');
const file = fs.readFileSync(lotteryPath, 'ut8');