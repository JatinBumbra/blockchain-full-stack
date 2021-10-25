const Block = require('./Block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  // Adds a new block to the blockchain
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }
}

module.exports = Blockchain;
