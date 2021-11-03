import React, { useEffect, useState } from 'react';
import Blocks from './Blocks';

const App = () => {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    fetch('/api/wallet-info')
      .then((res) => res.json())
      .then((data) => setWalletInfo(data));
  }, []);

  return (
    <div className='container mt-5'>
      <div className='pb-3'>
        <h2 className='mb-2'>
          <span className='text-primary'>Wallet</span> Info
        </h2>
        <div className='mb-3 border border-2 border-primary rounded-1'></div>
        <h4>Address</h4>
        <p className='small mb-3 text-black-50'>{walletInfo.address}</p>
        <h4>Balance</h4>
        <p className='small text-black-50'>{walletInfo.balance}</p>
      </div>
      <Blocks />
    </div>
  );
};

export default App;
