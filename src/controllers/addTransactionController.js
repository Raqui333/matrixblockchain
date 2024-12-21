const RSA = require('node-rsa');

module.exports = function (blockchain) {
  return (req, res) => {
    const { transaction, signature } = req.body;

    const key = new RSA();

    const keydata =
      '-----BEGIN PUBLIC KEY-----' +
      transaction.fromAddress +
      '-----END PUBLIC KEY-----';

    key.importKey(keydata, 'pkcs8-public');

    if (!key.verify(transaction.hash, signature, 'utf8', 'base64'))
      return res.status(418).send({ message: 'invalid signature' });

    const balance = blockchain.getBalanceFromAddress(transaction.fromAddress);

    if (balance < transaction.amount)
      return res.status(418).send({ message: 'Not enough balance' });

    try {
      blockchain.addTransaction(transaction);
    } catch (err) {
      return res.status(418).send({ message: err.message });
    }

    return res.status(200).send({
      message: 'Transaction added to blockchain',
    });
  };
};
