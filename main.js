const { Blockchain, Transaction } = require('./src/blockchain.js');
const RSA = require('node-rsa');

const express = require('express');
const app = express();
const PORT = 8080;

// start blockchain
const matrix = new Blockchain();
console.log('Block chain created!');

const genesis = new Transaction(null, 'raqui333', 50);
matrix.addTransaction(genesis);

app.use(express.json()); // should be set before API methods

app.use((req, res, next) => {
  res.on('finish', () => {
    if (!matrix.validateBlockChain()) throw new Error('Blockchain invalid');
  });

  next();
});

app.post('/createWallet', (req, res) => {
  const key = RSA({ b: 1024 }); // pair of keys

  const regex = new RegExp(
    '-----BEGIN .+ KEY-----|\n|-----END .+ KEY-----',
    'g'
  );

  const private_key = key.exportKey('private').replaceAll(regex, '');
  const address = key.exportKey('public').replaceAll(regex, '');

  return res.status(200).send({
    your_address: address,
    your_key: private_key,
  });
});

app.post('/mine/:address', (req, res) => {
  const { address } = req.params;

  const { guess_hash } = req.body;

  if (!guess_hash) {
    return res
      .status(418)
      .send({ message: 'Request body mising guess_hash key' });
  }

  const status = matrix.minePendingTransactions(String(guess_hash), address);

  if (status == -1) return res.status(418).send({ message: 'Wrong guess' });

  return res.status(200).send({
    message: 'Reward sent to your address!',
    address: address,
    amount: matrix.infoRewardForMining(),
  });
});

app.get('/getBalance/:address', (req, res) => {
  const { address } = req.params;

  const wallet_balance = matrix.getBalanceFromAddress(address);

  return res.status(200).send({
    address: address,
    balance: wallet_balance,
  });
});

app.listen(PORT, () => {
  console.log('Blockchain API listening on http://localhost:' + PORT);
});
