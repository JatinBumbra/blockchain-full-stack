const express = require('express');
const Blockchain = require('./Blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(express.json());

const PORT = 5000;

app.get('/api/blocks', (req, res) => {
  res.json({ blocks: blockchain.chain });
});
app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  res.redirect('/api/blocks');
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
