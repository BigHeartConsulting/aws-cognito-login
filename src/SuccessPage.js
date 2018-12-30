import React, { Component } from 'react';
var cognito = require('amazon-cognito-identity-js');

class SuccessPage extends Component {
  logOut() {
    var data = {
      UserPoolId : process.env.REACT_APP_POOL_ID, // your user pool id here
      ClientId : process.env.REACT_APP_CLIENT_ID // your app client id here
    };
    var userPool = new cognito.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
    window.location.reload();
  }

  render() {
    return (
      <div>
        Success! You can only get to this page if you are logged in
        <button onClick={this.logOut}>Log Out</button>
      </div>
    );
  }
}

export default SuccessPage;
