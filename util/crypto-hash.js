const crypto = require('crypto');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  return hash
    .update(
      inputs
        .map((i) => JSON.stringify(i))
        .sort()
        .join()
    )
    .digest('hex');
};

module.exports = cryptoHash;
