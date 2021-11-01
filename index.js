const express = require('express');
const request = require('request');
const Blockchain = require('./Blockchain');
const Pubsub = require('./pubsub');
// Init app
const app = express();
const blockchain = new Blockchain();
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
