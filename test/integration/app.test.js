const request = require('supertest');
const app = require('../../src/app');
const RSA = require('node-rsa');

describe('Testing route /createWallet', () => {
  it('Should return an wallet object with 200 status code', async () => {
    const response = await request(app).get('/createWallet').send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('your_address');
    expect(response.body).toHaveProperty('your_key');
  });
});

describe('Testing route /getBalance/:address', () => {
  it('Should return a balance object with 200 status code', async () => {
    const response = await request(app)
      .get('/getBalance/address_string')
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('balance');
    expect(response.body.address).toBe('address_string');
    expect(response.body.balance).toBe(0);
  });
});

describe('Testing transactions routes', () => {
  const person01 = new RSA({ b: 1024 });
  const person02 = new RSA({ b: 1024 });

  const regex = new RegExp(
    /\n|-{5}(BEGIN|END) (RSA\s)?(PRIVATE|PUBLIC) KEY-{5}/g
  );

  const person01_address = person01.exportKey('public').replace(regex, '');
  const person02_address = person02.exportKey('public').replace(regex, '');

  const transaction_data = {
    fromAddress: person01_address,
    toAddress: person02_address,
    amount: 50,
  };

  let signature;
  let transaction;

  describe('Testing route /createTransaction', () => {
    it('Should return a transaction object with 200 status code', async () => {
      const response = await request(app)
        .post('/createTransaction')
        .send(transaction_data);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('fromAddress');
      expect(response.body).toHaveProperty('toAddress');
      expect(response.body).toHaveProperty('amount');
      expect(response.body).toHaveProperty('hash');
      expect(response.body.fromAddress).toBe(transaction_data.fromAddress);
      expect(response.body.toAddress).toBe(transaction_data.toAddress);
      expect(response.body.amount).toBe(transaction_data.amount);

      transaction = response.body;
    });
  });

  describe('Testing route /sign', () => {
    it('Should return a signature object with 200 status code', async () => {
      const response = await request(app)
        .post('/sign')
        .send({
          private_key: person01.exportKey('private').replace(regex, ''),
          buffer: transaction.hash,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('signature');

      signature = response.body.signature;
    });
  });

  describe('Testing route /addTransaction', () => {
    it('Should return a message object with 418 status code', async () => {
      const response = await request(app).post('/addTransaction').send({
        transaction: transaction,
        signature: signature,
      });

      expect(response.statusCode).toBe(418);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Not enough balance');
    });
  });
});
