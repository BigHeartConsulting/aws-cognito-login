import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getLoggedInUser, isUserLoggedIn } from './userUtils'

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const cognitoUser = getLoggedInUser();
    const myBool = isUserLoggedIn(cognitoUser);

    return <Route {...rest} render={(props) => (
        myBool
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { referrer: props.location.pathname }
        }} />
    )} />
}

export default ProtectedRoute;
