import React, { useState } from 'react';
import ScreenLayout from '../layouts/ScreenLayout';

const ConductTransactionScreen = () => {
  const [recipient, setRecipient] = useState();
  const [amount, setAmount] = useState();
  const [alert, setAlert] = useState();

  const handleRecipient = (e) => {
    setRecipient(e.target.value);
  };
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const conductTransaction = (e) => {
    e.preventDefault();

    fetch('/api/transact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecipient();
        setAmount();
        setAlert({ type: 'success' });
      })
      .catch((err) =>
        setAlert({
          type: 'danger',
          message: 'Server returned an error',
        })
      )
      .finally(() => setTimeout(setAlert, 3000));
  };

  return (
    <ScreenLayout title='Conduct Transaction'>
      {alert ? (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role='alert'
        >
          <h5 className='alert-heading'>
            {alert.type === 'success'
              ? 'Transaction Successful!'
              : 'Unable to conduct transaction!'}
          </h5>
          <p className='small'>{alert.message}</p>
        </div>
      ) : null}
      <form onSubmit={conductTransaction}>
        <div className='form-group my-4'>
          <label htmlFor='recipeint' className='form-text mb-2'>
            Recipeint
          </label>
          <input
            type='text'
            value={recipient}
            onChange={handleRecipient}
            className='form-control'
            placeholder='Recipient wallet address'
            required
          />
        </div>
        <div className='form-group mb-4'>
          <label htmlFor='recipeint' className='form-text mb-2'>
            Amount
          </label>
          <input
            type='number'
            min={1}
            value={amount}
            onChange={handleAmount}
            className='form-control'
            required
          />
        </div>
        <button className='btn btn-primary mt-4' type='submit'>
          Transact
        </button>
      </form>
    </ScreenLayout>
  );
};

export default ConductTransactionScreen;
