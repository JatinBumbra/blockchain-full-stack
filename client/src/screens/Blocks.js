import React, { useEffect, useState } from 'react';
import Block from '../components/Block';

const BlocksScreen = () => {
  const [blocks, setBlocks] = useState();

  useEffect(() => {
    fetch('/api/blocks')
      .then((res) => res.json())
      .then((data) => setBlocks(data));
  }, []);

  return (
    <div>
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

export default BlocksScreen;
