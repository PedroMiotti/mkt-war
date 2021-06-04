
// Router
import { Switch, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import LobbyPage from './pages/Lobby';
import GamePage from './pages/Game';
import ResultPage from './pages/Result'

// Components
import ProtectedRoute from './components/ProtectedRoute';

const Router = () => {

  return(
    <Switch> 
      <Route path='/login' component={LoginPage} />
      <Route path='/register' component={RegisterPage} />

      <ProtectedRoute exact path='/' component={HomePage} />

      <ProtectedRoute path='/lobby/:matchId' component={LobbyPage} />
      <ProtectedRoute path='/game' component={GamePage} />
      <ProtectedRoute path='/result' component={ResultPage} />

    </Switch>

  )

}


export default Router;
