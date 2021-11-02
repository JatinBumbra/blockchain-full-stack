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
    <div>
      <p>Address:{walletInfo.address}</p>
      <p>Balance:{walletInfo.balance}</p>
      <Blocks />
    </div>
  );
};

export default App;
