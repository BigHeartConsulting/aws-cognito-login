import React, { Component } from 'react';
import getLoggedInUser from '../utils/userUtils'

class SuccessPage extends Component {
  logOut() {
    const cognitoUser = getLoggedInUser;
    cognitoUser.signOut();
    window.location.reload();
  }

  render() {
    return (
      <div>
        Success! You can only get to this page if you are logged in
        <button onClick={ this.logOut }>Log Out</button>
      </div>
    );
  }
}

export default SuccessPage;
