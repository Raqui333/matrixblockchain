const cors = require('cors');
const express = require('express');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json()); // should be set before API methods

const { Blockchain, Transaction } = require('./services/blockchain');

const validateBlockchain = require('./middleware/validateBlockchain');

const createWallet = require('./controllers/createWalletController');
const mine = require('./controllers/mineController');
const getBalance = require('./controllers/getBalanceController');
const createTransaction = require('./controllers/createTransactionController');
const addTransaction = require('./controllers/addTransactionController');
const login = require('./controllers/loginController');
const sign = require('./controllers/signController');

// start blockchain
const matrix = new Blockchain();
console.log('Block chain created!');

const genesis = new Transaction(null, 'raqui333', 50);
matrix.addTransaction(genesis);

// setup routes
app.use(validateBlockchain(matrix)); // validate blockchain each time a request is made

app.get('/createWallet', createWallet);
app.get('/getBalance/:address', getBalance(matrix));

app.post('/mine/:address', mine(matrix));
app.post('/createTransaction', createTransaction);
app.post('/addTransaction', addTransaction(matrix));
app.post('/login', login);
app.post('/sign', sign);

module.exports = app;
