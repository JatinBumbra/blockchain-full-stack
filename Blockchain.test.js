const Blockchain = require('./Blockchain');
const Block = require('./Block');

describe('class Blockchain', () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

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

  describe('static isValidChain()', () => {
    describe('chain does not start with genesis block', () => {
      it('returns false', () => {});
    });

    describe('chain starts with the genesis block and has multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'One' });
        blockchain.addBlock({ data: 'Two' });
        blockchain.addBlock({ data: 'Three' });
      });

      describe('and a lastHash reference has changed', () => {
        it('returns false', () => {
          blockchain.chain[0] = { data: 'invalid-genesis-block' };

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with invalid fields', () => {
        it('returns false', () => {
          blockchain.chain[2].data = 'changed data';

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains only valid blocks', () => {
        it('returns true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    let errorMock;

    beforeEach(() => {
      errorMock = jest.fn();
      global.console.error = errorMock;
    });

    describe('when new chain is not longer', () => {
      beforeEach(() => {
        newChain.chain[0] = { data: 'newChain' };

        blockchain.replaceChain(newChain.chain);
      });

      it('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it('logs an error', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'One' });
        newChain.addBlock({ data: 'Two' });
        newChain.addBlock({ data: 'Three' });
      });

      describe('and the new chain is invalid', () => {
        it('does not replace the chain', () => {
          newChain.chain[2].hash = 'invalid-hash';

          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe('and the new chain is valid', () => {
        it('replaces the chain', () => {
          blockchain.replaceChain(newChain.chain);

          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
