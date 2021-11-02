const express = require('express');
const request = require('request');
const Wallet = require('./wallet');
const Blockchain = require('./blockchain');
const TransactionPool = require('./wallet/transaction-pool');
const Pubsub = require('./app/pubsub');
const TransactionMiner = require('./app/transaction-miner');
// Init app
const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const pubsub = new Pubsub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});
// Port declaration
const DEFAULT_PORT = 5000;
let PEER_PORT;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
// Enable JSON parsing
app.use(express.json());
// Generate a peer server
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
  pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});
app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

const syncWithRootNode = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const rootChain = JSON.parse(body);
      blockchain.replaceChain(rootChain);
    }
  });

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const rootTransactionMap = JSON.parse(body);
        transactionPool.setMap(rootTransactionMap);
      }
    }
  );
};

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootNode();
  }
});
