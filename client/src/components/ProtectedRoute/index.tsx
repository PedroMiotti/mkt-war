import React from 'react';

//Route
import { Route, Redirect, RouteProps } from 'react-router-dom';

// Helpers
import { getCookie } from '../../utils/handleCookie'


interface IPrivateRouteProps extends RouteProps{
  // tslint:disable-next-line:no-any
  component: any
}

const ProtectedRoute = (props: IPrivateRouteProps) => {
  const {component: Component, ...rest } = props;

  return(
    <Route {...rest} render={props => (
        getCookie('_token') != ""
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />


  )
}

export default ProtectedRoute;
