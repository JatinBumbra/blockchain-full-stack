const Blockchain = require('./Blockchain');
const Block = require('./Block');

describe('class Blockchain', () => {
  const blockchain = new Blockchain();

  it('contains a `chain` array', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the `chain`', () => {
    const newData = 'newData';

    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
});
