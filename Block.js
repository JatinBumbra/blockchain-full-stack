const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }
  // Creates a genesis block to start the blockchain with
  static genesis() {
    return new this(GENESIS_DATA);
  }
  // Mines and returns a new block
  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;

    return new this({
      timestamp,
      lastHash,
      hash: cryptoHash(timestamp, data, lastHash),
      data,
    });
  }
}

module.exports = Block;
