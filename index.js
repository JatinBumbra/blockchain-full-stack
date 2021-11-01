const express = require('express');
const request = require('request');
const Wallet = require('./wallet');
const Blockchain = require('./blockchain');
const TransactionPool = require('./wallet/transaction-pool');
const Pubsub = require('./app/pubsub');
// Init app
const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const pubsub = new Pubsub({ blockchain });
// Port declaration
const DEFAULT_PORT = 5000;
let PEER_PORT;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(express.json());

if (process.env.GENERATE_PEER_PORT) {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 100);
}

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });
  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });
    }
  } catch (error) {
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);

  res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('syncing with root chain', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});
