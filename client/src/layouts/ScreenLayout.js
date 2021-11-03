import React from 'react';
import Header from '../components/Header';

const ScreenLayout = ({ children, title }) => {
  return (
    <div>
      <Header />
      <div className='container my-5'>
        <h2 className='mb-2'>{title}</h2>
        <div className='mb-3 border border-2 border-primary rounded-1'></div>
        {children}
      </div>
    </div>
  );
};

export default ScreenLayout;
