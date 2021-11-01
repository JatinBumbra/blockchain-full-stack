const Blockchain = require('../blockchain');

const blockchain = new Blockchain();
blockchain.addBlock({
  data: 'block-0',
});

let prevTimestamp,
  nextTimestamp,
  nextBlock,
  timeDiff,
  average,
  times = [];

for (let i = 1; i < 2000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({ data: `block-${i}` });

  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  average = times.reduce((total, i) => total + i) / times.length;

  console.log(
    `Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}`
  );
}
