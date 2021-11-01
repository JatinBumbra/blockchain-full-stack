const hexToBinary = require('hex-to-binary');
const Block = require('./Block');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');

describe('class Block', () => {
  let timestamp = Date.now(),
    lastHash = 'lasthash',
    hash = 'hash',
    data = [],
    nonce = 1,
    difficulty = 1,
    block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

  it('has a timestamp, lastHash, hash, and data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('static genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe('static mineBlock()', () => {
    const lastBlock = Block.genesis();
    const data = 'mine-data';
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it('returns a Block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('sets the `lastHash` to be the `hash` of the last block', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it('sets the `data`', () => {
      expect(minedBlock.data).toEqual(data);
    });

    it('sets the `timestamp`', () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it('creates a SHA-256 `hash` based on the proper inputs', () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          data,
          lastBlock.hash,
          minedBlock.nonce,
          minedBlock.difficulty
        )
      );
    });

    it('sets a `hash` that matches the difficulty criteria', () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('adjusts the difficulty', () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe('static adjustDifficulty()', () => {
    it('raises difficulty for quickly mined block', () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it('lowers difficulty for slowly mined block', () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it('has a lower limit of 1', () => {
      block.difficulty = -1;

      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
