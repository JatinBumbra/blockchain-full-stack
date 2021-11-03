import React, { useState } from 'react';
import Transaction from './Transaction';

const Block = ({ block }) => {
  const [displayMore, setDisplayMore] = useState(false);

  const stringifiedData = JSON.stringify(block.data);

  const toggleDisplayMore = () => setDisplayMore((prev) => !prev);

  return (
    <div className={`col col-lg-${displayMore ? '12' : '4'} py-2 small`}>
      <div className='block p-4'>
        <p>
          <strong>Hash: </strong>
          <span className='text-black-50'>
            {displayMore
              ? block.hash
              : block.hash.length > 15
              ? block.hash.slice(0, 15) + '...'
              : block.hash}
          </span>
        </p>
        <p>
          <strong>Timestamp: </strong>
          <span className='text-black-50'>
            {new Date(block.timestamp).toLocaleString()}
          </span>
        </p>
        <p>
          <strong>Block: </strong>
          {displayMore ? (
            block.data.map((transaction) => (
              <Transaction transaction={transaction} />
            ))
          ) : (
            <span className='text-black-50'>
              {stringifiedData.length > 50
                ? stringifiedData.slice(0, 100) + '...'
                : stringifiedData}
            </span>
          )}
        </p>
        <button className='btn btn-primary btn-sm' onClick={toggleDisplayMore}>
          Show {displayMore ? 'Less' : 'More'}
        </button>
      </div>
    </div>
  );
};

export default Block;
