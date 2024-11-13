const { Blockchain, Transaction } = require('./src/blockchain.js');
const { Wallet } = require('./src/wallet.js');

const matrix = new Blockchain();
console.log('Block chain created!');

// genesis mine
const genesis = new Transaction(null, 'raqui333', 50);
matrix.addTransaction(genesis);

// test
const first_person = new Wallet('Person 01', matrix);
const second_person = new Wallet('Person 02', matrix);

for (let i = 0; i < 20; i++) {
  first_person.mineBlock();
}

first_person.printWalletInfo();

first_person.sendCoins(second_person.getWalletAddress(), 300);
first_person.mineBlock();

second_person.printWalletInfo();

if (matrix.validateBlockChain()) console.log('\nBlockchain is valid');
