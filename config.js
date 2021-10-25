const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;

const GENESIS_DATA = {
  timestamp: Date.now(),
  data: [],
  lastHash: 'genesis-lastHash',
  hash: 'genesis-hash',
  difficulty: INITIAL_DIFFICULTY,
};

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
};
