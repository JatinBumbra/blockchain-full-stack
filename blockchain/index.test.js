const Blockchain = require('.');
const Block = require('./Block');
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
const { cryptoHash } = require('../util');

describe('class Blockchain', () => {
  let blockchain, newChain, originalChain, errorMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;

    errorMock = jest.fn();
    global.console.error = errorMock;
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

      describe('and the chain contains a block with jumped difficulty', () => {
        it('returns false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;

          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const invalidBlock = new Block({
            lastHash,
            hash,
            data,
            difficulty,
            nonce,
            timestamp,
          });
          blockchain.chain.push(invalidBlock);

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

    describe('the `ValidateTransactions` flag is set', () => {
      it('calls `validTransactionData()`', () => {
        const validTransactionDataMock = jest.fn();

        blockchain.validTransactionData = validTransactionDataMock;

        newChain.addBlock({ data: 'data' });
        blockchain.replaceChain(newChain.chain, true);

        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });
  });

  describe('validTransactionData()', () => {
    let transaction, rewardTransaction, wallet;

    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({
        recipient: 'recipient',
        amount: 50,
      });
      rewardTransaction = Transaction.rewardTransaction({
        minerWallet: wallet,
      });
    });

    describe('transaction data is valid', () => {
      it('returns true', () => {
        newChain.addBlock({ data: [transaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          true
        );
      });
    });

    describe('transaction data has multiple rewards', () => {
      it('returns false and logs an error', () => {
        newChain.addBlock({
          data: [transaction, rewardTransaction, rewardTransaction],
        });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('transaction data has malformed outputMap', () => {
      describe('transaction is not a reward transaction', () => {
        it('returns false and logs an error', () => {
          transaction.outputMap[wallet.publicKey] = 999999;

          newChain.addBlock({ data: [transaction, rewardTransaction] });

          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe('transaction is a reward transaction', () => {
        it('returns false and logs an error', () => {
          rewardTransaction.outputMap[wallet.publicKey] = 999999;

          newChain.addBlock({ data: [transaction, rewardTransaction] });

          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe('transaction data has malformed input', () => {
      it('returns false and logs an error', () => {
        wallet.balance = 9000;

        const invalidOutputMap = {
          [wallet.publicKey]: 8900,
          fooRecipient: 100,
        };
        const invalidTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(invalidOutputMap),
          },
          outputMap: invalidOutputMap,
        };

        newChain.addBlock({ data: [invalidTransaction, rewardTransaction] });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('block contains multiple identical transactions', () => {
      it('returns false and logs an error', () => {
        newChain.addBlock({
          data: [transaction, transaction, transaction, rewardTransaction],
        });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
