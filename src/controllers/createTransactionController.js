const { Transaction } = require('../services/blockchain');

module.exports = function createTransaction(req, res) {
  const { fromAddress, toAddress, amount } = req.body;
  const transaction = new Transaction(fromAddress, toAddress, amount);
  res.status(200).send(transaction);
};
