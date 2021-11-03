import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
import BlocksScreen from './Blocks';
import ConductTransactionScreen from './ConductTransaction';
import HomeScreen from './Home';
import TransactionPoolScreen from './TransactionPool';

const Screens = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={HomeScreen} />
        <Route exact path='/blocks' component={BlocksScreen} />
        <Route
          exact
          path='/conduct-transaction'
          component={ConductTransactionScreen}
        />
        <Route
          exact
          path='/transaction-pool'
          component={TransactionPoolScreen}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Screens;
