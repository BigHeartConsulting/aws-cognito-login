import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import getLoggedInUser from './userUtils'

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const cognitoUser = getLoggedInUser();

    let isUserLoggedIn = false;

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }

            isUserLoggedIn = session.isValid();
        });
    }
    
    return <Route {...rest} render={(props) => (
        isUserLoggedIn
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { referrer: props.location.pathname }
        }} />
    )} />
}

export default ProtectedRoute;
