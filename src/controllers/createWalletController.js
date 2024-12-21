const RSA = require('node-rsa');

module.exports = function createWallet(_req, res) {
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
};
