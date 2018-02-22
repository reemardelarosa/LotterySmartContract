const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = Web3(provider);

const { interface, bytecode } = require('../compile');