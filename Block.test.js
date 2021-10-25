const Block = require('./Block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('class Block', () => {
  let timestamp = Date.now(),
    lastHash = 'lasthash',
    hash = 'hash',
    data = [],
    block = new Block({ timestamp, lastHash, hash, data });

  it('has a timestamp, lastHash, hash, and data property', () => {
    expect(block).toHaveProperty('timestamp');
    expect(block).toHaveProperty('lastHash');
    expect(block).toHaveProperty('hash');
    expect(block).toHaveProperty('data');
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
        cryptoHash(minedBlock.timestamp, data, lastBlock.hash)
      );
    });
  });
});
