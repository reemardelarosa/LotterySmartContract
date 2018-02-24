const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile.js');

const provider = new HDWalletProvider(
    'test',
    'https://rinkeby.infura.io/6ztB38B0qhuJuFgKmEnt'
);

const web3 = Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    const result = await web3.eth.Contract(JSON.parse(interface))
      .deploy({data: bytecode, arguments: []})
      .send( {from: accounts[0], gas: '1000000'});
};


deploy();