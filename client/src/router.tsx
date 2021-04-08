import React from 'react';

// Router
import { Switch, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const Router = () => {


  return(
    <Switch> 
      <Route path='/login' component={LoginPage} />
      <Route path='/register' component={RegisterPage} />

      <ProtectedRoute path='/home' component={HomePage} />

    </Switch>

  )

}


export default Router;
