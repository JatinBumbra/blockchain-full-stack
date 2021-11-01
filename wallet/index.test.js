const Wallet = require('.');
const Transaction = require('./transaction');
const { verifySignature } = require('../util');

describe('class Wallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it('has a `balance`', () => {
    expect(wallet).toHaveProperty('balance');
  });
  it('has a `publicKey`', () => {
    expect(wallet).toHaveProperty('publicKey');
  });

  describe('signing data', () => {
    const data = 'foo';

    it('verifies a signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe('createTransaction()', () => {
    let transaction, amount, recipient;

    beforeEach(() => {
      amount = 50;
      recipient = 'recipient';
      transaction = wallet.createTransaction({ recipient, amount });
    });

    describe('the amount exceeds the wallet balance', () => {
      it('throws an error', () => {
        expect(() =>
          wallet.createTransaction({ amount: 999999, recipient: 'recipient' })
        ).toThrow('Amount exceeds balance');
      });
    });
    describe('the amount is valid', () => {
      it('creates in instance of `Transaction`', () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it('matches the transaction input with the wallet', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });
      it('outputs the amount to the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });
});
