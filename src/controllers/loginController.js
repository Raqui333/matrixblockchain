const RSA = require('node-rsa');

module.exports = function login(req, res) {
  const { public_key, private_key } = req.body;

  const key = new RSA();

  const keydata =
    '-----BEGIN RSA PRIVATE KEY-----' +
    private_key +
    '-----END RSA PRIVATE KEY-----';

  key.importKey(keydata, 'pkcs1-private');

  const regex = new RegExp(
    '-----BEGIN .+ KEY-----|\n|-----END .+ KEY-----',
    'g'
  );

  if (key.exportKey('public').replaceAll(regex, '') === public_key)
    return res.status(200).send({ message: 'logged' });

  return res.status(418).send({ message: 'key pair do not match' });
};
