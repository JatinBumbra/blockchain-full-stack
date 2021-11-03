import React, { useEffect, useState } from 'react';
import ScreenLayout from '../layouts/ScreenLayout';

const HomeScreen = () => {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    fetch('/api/wallet-info')
      .then((res) => res.json())
      .then((data) => setWalletInfo(data));
  }, []);

  return (
    <ScreenLayout title='Wallet info'>
      <div className='pb-3'>
        <h4>Address</h4>
        <p className='small mb-3 text-black-50'>{walletInfo.address}</p>
        <h4>Balance</h4>
        <p className='small text-black-50'>{walletInfo.balance}</p>
      </div>
    </ScreenLayout>
  );
};

export default HomeScreen;
