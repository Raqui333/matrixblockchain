const RSA = require('node-rsa');
const { Transaction } = require('./blockchain.js');

class Wallet {
  constructor(wallet_name, blockchain) {
    this.blockchain = blockchain;
    this.wallet_name = wallet_name;

    this.wallet_key = RSA({ b: 1024 }); // pair of keys
    this.wallet_address = this.wallet_key.exportKey('public');

    this.balance = 0;
  }

  addressToString(address) {
    const regex = new RegExp(
      '-----BEGIN PUBLIC KEY-----|\n|-----END PUBLIC KEY-----',
      'g'
    );

    const string = address.replaceAll(regex, '');

    if (string.length < 50) return string;

    return (
      string.substring(0, 50) +
      ' ... [more ' +
      (string.length - 50) +
      ' characters]'
    );
  }

  getWalletAddress() {
    return this.wallet_address;
  }

  updateWalletBalace() {
    this.balance = this.blockchain.getBallanceFromAddress(this.wallet_address);
  }

  printWalletInfo() {
    this.updateWalletBalace();
    console.log('\nMATRIX WALLET');
    console.log('Name    :', this.wallet_name);
    console.log('Address :', this.addressToString(this.wallet_address));
    console.log('Balance :', this.balance, 'MTC');
  }

  sendCoins(toAddress, amount) {
    this.updateWalletBalace();

    if (amount > this.balance) {
      console.log('\nNot enough coins to send');
      return -1;
    }

    console.log('\nSending', amount, 'MTC to', this.addressToString(toAddress));

    const transaction = new Transaction(this.wallet_address, toAddress, amount);
    transaction.signTransaction(this.wallet_key);

    this.blockchain.addTransaction(transaction);

    console.log('\nTransaction added to blockchain');
  }

  mineBlock() {
    console.log('\n Starting to mine block...');

    const block_mined_hash = this.blockchain.minePendingTransactions(
      this.wallet_address
    );

    console.log(' Block mined:', block_mined_hash);
  }
}

module.exports = {
  Wallet,
};
