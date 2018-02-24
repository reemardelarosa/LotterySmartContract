// imports
/// assert-testing, ganache-cli - local eth network, web3 - FE to ETH network connector
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

// compiled contract
/// interface and bytecode
const { interface, bytecode } = require('../compile');

// setup
/// initialize, deploy and sendcontract to the network
let lottery, accounts
beforeEach(async () => {
    // get all accounts
    accounts = await web3.eth.getAccounts();
    
    // setup, deploy, send
    lottery = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: [] })
      .send({ from: accounts[0], gas: '1000000' });
});

// Lottery Contract Unit Testing
describe('Lottery', () => {
    // test if sent contract is valid
    it('is valid contract', () => {
        assert.ok(lottery.options.address);
    });

    // test 1 player enter
    it('can enter one player', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.2', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({ from: accounts[0] })
        assert.equal(accounts[0], players[0]);
    });

    // test multi player
    it('can enter multiple players', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('.2', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('.2', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('.2', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    // test minimum ether payment
    it('will have error if the player will send less than .01 ether', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    // test if only owner can pick winner
    it('will have error if non manager trigger pick winner', async () => {
        try {
            await lottery.method.pickWinner().send({ from: accounts[1] });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    // end to end testing
    it('can enter player, pick a winner, sends money and reset the players array', async () => {
        /// Enter one player
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });
        /// Initial Balance
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        /// Pick winner
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        /// Final Balance
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.9', 'ether'));
        /// Test if players array is reset
        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
        assert.deepEqual([], players);

    });
});



