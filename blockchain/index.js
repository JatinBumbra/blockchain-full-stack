const Block = require('./Block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const e = require('express');

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
  replaceChain(chain, validateTransactions, onSuccess) {
    if (chain.length <= this.chain.length)
      return console.error('Incoming chain must be longer');

    if (!Blockchain.isValidChain(chain))
      return console.error('Incoming chain must be valid');

    if (validateTransactions && !this.validTransactionData({ chain })) {
      return console.error('Incoming chain has invalid data');
    }

    if (onSuccess) onSuccess();

    this.chain = chain;
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        // Transaction is a reward transaction
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount++;

          if (rewardTransactionCount > 1) {
            console.error('Miner reward exceeds limit');
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error('Miner reward amount is invalid');
            return false;
          }
        } else {
          // Transaction is not a reward transaction
          if (!Transaction.validTransaction(transaction)) {
            console.error('Invalid transaction');
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });

          if (transaction.input.amount !== trueBalance) {
            console.error('Invalid input amount');
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error('Duplicate transaction');
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }
}

module.exports = Blockchain;
