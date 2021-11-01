const crypto = require('crypto');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  return hash.update(inputs.sort().join()).digest('hex');
};

module.exports = cryptoHash;
