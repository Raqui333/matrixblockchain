const RSA = require('node-rsa');

module.exports = function sign(req, res) {
  const { private_key, buffer } = req.body;

  const key = new RSA();

  const keydata =
    '-----BEGIN RSA PRIVATE KEY-----' +
    private_key +
    '-----END RSA PRIVATE KEY-----';

  key.importKey(keydata, 'pkcs1-private');

  const signature = key.sign(buffer, 'base64', 'utf8');

  return res.status(200).send({ signature: signature });
};
