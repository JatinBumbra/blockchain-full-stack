import React, { useEffect, useState } from 'react';

const Blocks = () => {
  const [blocks, setBlocks] = useState();

  useEffect(() => {
    fetch('/api/blocks')
      .then((res) => res.json())
      .then((data) => setBlocks(data));
  }, []);

  return (
    <div>
      <h3>Blocks</h3>
      {blocks
        ? blocks.map((block) => (
            <div key={block.hash}>
              <p>Hash: {block.hash}</p>
            </div>
          ))
        : null}
    </div>
  );
};

export default Blocks;
