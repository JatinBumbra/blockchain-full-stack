import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '../components/Header';
import BlocksScreen from './Blocks';
import HomeScreen from './Home';

const Screens = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className='container my-5'>
        <Switch>
          <Route exact path='/' component={HomeScreen} />
          <Route exact path='/blocks' component={BlocksScreen} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Screens;
