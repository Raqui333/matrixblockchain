const SHA256 = require('crypto-js/sha256');
const RSA = require('node-rsa');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signer_key) {
    if (signer_key.exportKey('public') !== this.fromAddress)
      throw new Error('You cannot sign transactions from other wallets');

    this.transactionHash = this.calculateHash();

    this.signature = signer_key.sign(this.transactionHash);
  }

  verifyTransaction() {
    if (this.fromAddress === null) return true; // for mining rewards

    if (!this.signature || this.signature.length === 0)
      throw new Error('No valid signature for transaction');

    const key = new RSA().importKey(this.fromAddress, 'public');
    return key.verify(this.transactionHash, this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = null) {
    this.nonce = 0;
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

  mineBlock(hardness) {
    while (this.hash.substring(0, hardness) !== Array(hardness + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    return this.hash;
  }
}

class Blockchain {
  constructor() {
    this.chain = [new Block(Date.parse('01/01/2024'), 'GenesisBlock')];
    this.blockchain_difficult = 4;
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

  minePendingTransactions(rewardToAddress) {
    const new_block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLastBlock().hash
    );

    const block_mined_hash = new_block.mineBlock(this.blockchain_difficult);
    this.chain.push(new_block);

    this.pendingTransactions = [
      new Transaction(null, rewardToAddress, this.rewardForMining),
    ];

    return block_mined_hash;
  }

  addTransaction(transaction) {
    if (!transaction.toAddress)
      throw new Error('Transaction must include toAddress');

    if (!transaction.verifyTransaction())
      throw new Error('Cannot add invalid transaction to blockchain');

    this.pendingTransactions.push(transaction);
  }

  getBallanceFromAddress(wallet_address) {
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
