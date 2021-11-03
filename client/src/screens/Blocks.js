import React, { useEffect, useState } from 'react';
import Block from '../components/Block';
import ScreenLayout from '../layouts/ScreenLayout';

const BlocksScreen = () => {
  const [blocks, setBlocks] = useState();

  useEffect(() => {
    fetch('/api/blocks')
      .then((res) => res.json())
      .then((data) => setBlocks(data));
  }, []);

  return (
    <ScreenLayout title='Blocks'>
      <div className='row'>
        {blocks
          ? blocks.map((block) => <Block key={block.hash} block={block} />)
          : null}
      </div>
    </ScreenLayout>
  );
};

export default BlocksScreen;
