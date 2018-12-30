import React from 'react';
import { Redirect, Route } from 'react-router-dom';
var cognito = require('amazon-cognito-identity-js');

const ProtectedRoute = ({ component: Component, ...rest }) => {
    var data = {
        UserPoolId : process.env.REACT_APP_POOL_ID, // your user pool id here
        ClientId : process.env.REACT_APP_CLIENT_ID // your app client id here
      };
    var userPool = new cognito.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    let userLoggedIn = false;

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }

            userLoggedIn = session.isValid();
        });
    }
    
    return <Route {...rest} render={(props) => (
        userLoggedIn
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { referrer: props.location.pathname }
        }} />
    )} />
}

export default ProtectedRoute;
