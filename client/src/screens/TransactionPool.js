import React, { useEffect, useState } from 'react';
import Transaction from '../components/Transaction';
import ScreenLayout from '../layouts/ScreenLayout';

const TransactionPoolScreen = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  const fetchTransactionPoolMap = () =>
    fetch('/api/transaction-pool-map')
      .then((res) => res.json())
      .then((data) => setTransactionPoolMap(data));

  useEffect(() => {
    fetchTransactionPoolMap();
    const interval = setInterval(fetchTransactionPoolMap, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScreenLayout title='Transaction Pool'>
      {Object.values(transactionPoolMap).map((transaction) => (
        <div className='block small' key={transaction.id}>
          <Transaction transaction={transaction} />
        </div>
      ))}
    </ScreenLayout>
  );
};

export default TransactionPoolScreen;
