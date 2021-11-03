import React, { useEffect, useState } from 'react';
import Block from './Block';

const Blocks = () => {
  const [blocks, setBlocks] = useState();

  useEffect(() => {
    fetch('/api/blocks')
      .then((res) => res.json())
      .then((data) => setBlocks(data));
  }, []);

  return (
    <div className='my-5'>
      <h3>Blocks</h3>
      <div className='mb-2 border border-2 border-primary rounded-1'></div>
      <div className='row'>
        {blocks
          ? blocks.map((block) => <Block key={block.hash} block={block} />)
          : null}
      </div>
    </div>
  );
};

export default Blocks;
