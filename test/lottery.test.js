const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let lottery, accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: [] })
      .send({ from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address, 'Lottery Contract must return an address');
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.011', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(3, players.length);
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
    });

    it('requires a minimium amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts,
                value: 0
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('only manager can call pick winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch(error) {
            assert(error);
        }
    });

    it('sends money to the winner and resets the players array', async () => {
        let players, winner;
        // enter the lotter - 1 player
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0], players[0], 'First account is the only player');
        // assert.equal(accounts[0], players[0], 'First account\'s balance);
        // pick a winner
        await lottery.methods.pickWinner().send({
            from: accounts[0],
        });
        console.log(initialBalance);
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        console.log(finalBalance);
        // transfer the balance to the winning player
        // resets the players array
        players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.deepEqual([], players, 'Empty Players Array');

        // let winningBalance = web3.utils.fromWei(web3.eth.getBalance(accounts[0]));
        // assert.equal(102, winningBalance, 'Winning Player\'s Balance');
    });
});