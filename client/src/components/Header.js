import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className='sticky-top bg-white shadow'>
      <div className='container py-3 d-flex align-items-center justify-content-between'>
        <Link
          to='/'
          className='logo small py-2 px-4 text-white bg-primary rounded'
        >
          JayCoin
        </Link>
        <nav className='d-flex'>
          <NavLink to='/' exact className='mx-3 small'>
            Home
          </NavLink>
          <NavLink to='/blocks' exact className='mx-3 small'>
            Blocks
          </NavLink>
          <NavLink to='/conduct-transaction' exact className='mx-3 small'>
            Transact
          </NavLink>
          <NavLink to='/transaction-pool' exact className='mx-3 small'>
            View Pool
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
