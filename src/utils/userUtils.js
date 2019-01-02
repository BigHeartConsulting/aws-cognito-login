let cognito = require('amazon-cognito-identity-js');

const getLoggedInUser = () => {
    let data = {
        UserPoolId : process.env.REACT_APP_POOL_ID, // your user pool id here
        ClientId : process.env.REACT_APP_CLIENT_ID // your app client id here
      };
    let userPool = new cognito.CognitoUserPool(data);
    return userPool.getCurrentUser();
}

export default getLoggedInUser;