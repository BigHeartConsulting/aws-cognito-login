let cognito = require('amazon-cognito-identity-js');

export function isUserLoggedIn(cognitoUser) {
    let isLoggedIn = false;

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }

            isLoggedIn = session.isValid();
        });
    }

    return isLoggedIn;
}

export function getLoggedInUser() {
    let data = {
        UserPoolId : process.env.REACT_APP_POOL_ID, // your user pool id here
        ClientId : process.env.REACT_APP_CLIENT_ID // your app client id here
    };

    let userPool = new cognito.CognitoUserPool(data);

    return userPool.getCurrentUser();
}