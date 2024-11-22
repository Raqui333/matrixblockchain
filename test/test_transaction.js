const RSA = require('node-rsa');

// this is only meant for testing, private key should be kept hidden
const key = new RSA(
  '-----BEGIN RSA PRIVATE KEY-----' +
    'MIICXgIBAAKBgQDfpEA9kIzN82SKf4XjtyEDaqX45l1HQycu+KeoHTh4jJAVku2sO4Iwf4s38Bx92Iqz+DfdOsV/77gsnvYGeIePRW/ygotETONWHRy/A31VlnMJYSFBtEh3bWFJfN/vQVyqg5wYVAiWNgsOcX/JKJwZCaT2YkRgEmJecvo/3BxGkwIDAQABAoGBANh3+MJehxvWCixQsP0wReEzuoEIIaOXqXa6sjV0SzPMAq8PL8R1OVfOLKgxXrKlBeSbTx9xArgKBcATAVpUEgjZHQEuq9E+mqVow20CXzFs8lyy2Yc4Yu/dpFereY9YOHCvrsMLZC9lDEWyUp1kMoXf+UiSViwfmEZ3/NALao5BAkEA90b+NvKuNzHW+MuIQGRq4uyUf+njqXg1y9YaAgh4wgdApPvRZwQm3J/24YusiDfaPVZcoZyWPob7fEVmLBMsYQJBAOeH0Y3L5UQdmEtVl+7IPMPi8k1ZmOXuZ9BU+Dd6YLngFQUj6pDc5AW5jLjkzDrCOgi2L1OX+I2RHVkbIyCGt3MCQQC47FOi3hwhVNlyWCu+FBrHN6vaeRxzmV2J4cSzboh4ehoDB/tS8gzqA4sKo3zUpghExLgjeEn32tRp3DCLl48hAkEA5qlV6OlIOGsvjWXxnm8YsqLHeK4ZeIDiJhhwzXx7HtMSvfNBPh8CgH2Rp6YxnRxhCsrOLX7KnecDkQFLJp1v5wJAc5zPXj1KanyqH20Z8SrbUa48Zc41T5v3zBD97GawBGCcJAkJ6kkYhBXqk4YJZfUGFKGoOZitSMXysOid8lBQ3w==' +
    '-----END RSA PRIVATE KEY-----'
);

async function createTransaction(from, to, amount) {
  const URL = 'http://localhost:8080';

  const request_body = {
    fromAddress: from,
    toAddress: to,
    amount: amount,
  };

  const response = await fetch(URL + '/createTransaction', {
    method: 'POST',
    body: JSON.stringify(request_body),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  const transaction = data;
  const signature = key.sign(data.hash, 'base64', 'utf8');

  return { transaction: transaction, signature: signature };
}

async function addTransaction(transaction, signature) {
  const URL = 'http://localhost:8080';

  const request_body = {
    transaction: transaction,
    signature: signature,
  };

  const response = await fetch(URL + '/addTransaction', {
    method: 'POST',
    body: JSON.stringify(request_body),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  console.log(data);
}

async function main() {
  // create a transaction 'from' an address, 'to' another 'address' with the 'amount' of coins
  const { transaction, signature } = await createTransaction(
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfpEA9kIzN82SKf4XjtyEDaqX45l1HQycu+KeoHTh4jJAVku2sO4Iwf4s38Bx92Iqz+DfdOsV/77gsnvYGeIePRW/ygotETONWHRy/A31VlnMJYSFBtEh3bWFJfN/vQVyqg5wYVAiWNgsOcX/JKJwZCaT2YkRgEmJecvo/3BxGkwIDAQAB',
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYw/jUN8+eja8VUfiLaB/XgT3Xf6At06T9wLSGjIVcQmLjmctejBdmTjTGC6ThbIQR/IYIM2049TK8wZEINHNLePeO4w0fw3wwAIDggwOmD1+7Y5EkU3Q540JznqwFk4Vh14XWwD5nPUEV+RMwObSh/4yYTdGqpE0VOCDew4i4cQIDAQAB',
    10
  );

  // send the original transaction and signature, this is for the server make sure
  // that the sender is exactly you and not someone trying to impersonate you
  await addTransaction(transaction, signature);
}

(async () => {
  await main();
})();
