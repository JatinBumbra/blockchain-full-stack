import React from 'react';

const Transaction = ({ transaction: { input, outputMap } }) => {
  return (
    <div className='border-top border-2 my-2 py-2'>
      <p>
        <strong>From: </strong>
        <span className='text-black-50'>{input.address}</span>
      </p>
      {Object.keys(outputMap).map((recipient) => (
        <p key={recipient}>
          <strong>To: </strong>
          <span className='text-black-50'>{recipient}</span> |{' '}
          <strong>Sent: </strong>
          <span className='text-black-50'>{outputMap[recipient]}</span>
        </p>
      ))}
    </div>
  );
};

export default Transaction;
