const Block = require('./Block');
const { cryptoHash } = require('../util');

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
  // Validate chain
  static isValidChain(chain) {
    // If starting block is not genesis block, reject chain
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;
      // Return false if last hash reference has changed
      if (actualLastHash !== lastHash) return false;
      // Validate hash to validate block data
      if (hash !== cryptoHash(timestamp, lastHash, data, nonce, difficulty))
        return false;
      // Avoid difficulty jumps
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }
  // Replace existing change with new incoming chain
  replaceChain(chain) {
    if (chain.length <= this.chain.length)
      return console.error('Incoming chain must be longer');

    if (!Blockchain.isValidChain(chain))
      return console.error('Incoming chain must be valid');

    this.chain = chain;
  }
}

module.exports = Blockchain;
