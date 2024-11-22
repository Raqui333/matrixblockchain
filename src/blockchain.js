const SHA256 = require('crypto-js/sha256');
const RSA = require('node-rsa');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + Date.now()
    ).toString();
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = null) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.timestamp + this.transactions + this.previousHash + this.nonce
    ).toString();
  }

  mineBlock(guess_hash, hardness) {
    if (guess_hash.substring(0, hardness) !== this.hash.substring(0, hardness))
      return -1; // prettier-ignore

    return this.hash;
  }
}

class Blockchain {
  constructor() {
    this.chain = [new Block(Date.parse('01/01/2024'), 'GenesisBlock')];
    this.blockchain_difficult = 2;
    this.pendingTransactions = [];
    this.rewardForMining = 50;
  }

  validateBlockChain() {
    for (let i = 1; i < this.chain.length; ++i) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash())
        return false; // prettier-ignore

      if (currentBlock.previousHash !== previousBlock.calculateHash())
        return false;
    }

    return true;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  infoRewardForMining() {
    return this.rewardForMining;
  }

  minePendingTransactions(guess_hash, rewardToAddress) {
    const new_block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLastBlock().hash
    );

    const block_mined_hash = new_block.mineBlock(
      guess_hash,
      this.blockchain_difficult
    );

    if (block_mined_hash == -1) return -1;

    this.chain.push(new_block);

    this.pendingTransactions = [
      new Transaction(null, rewardToAddress, this.rewardForMining),
    ];

    return block_mined_hash;
  }

  addTransaction(transaction) {
    for (const pen_transaction of this.pendingTransactions) {
      if (pen_transaction.fromAddress == transaction.fromAddress)
        throw new Error('Your previous transaction is still pending');
    }

    if (!transaction.toAddress)
      throw new Error('Transaction must include toAddress');

    this.pendingTransactions.push(transaction);

    return 0;
  }

  getBalanceFromAddress(wallet_address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === wallet_address)
          balance -= transaction.amount;

        if (transaction.toAddress === wallet_address)
          balance += transaction.amount;
      }
    }

    return balance;
  }
}

module.exports = {
  Blockchain,
  Transaction,
};
