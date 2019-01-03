import React, { Component } from 'react';
import { getLoggedInUser } from '../utils/userUtils'

class ProtectedPage extends Component {
  logOut() {
    const cognitoUser = getLoggedInUser();
    cognitoUser.signOut();
    window.location.reload();
  }

  render() {
    return (
      <div>
        You can only get to this page if you are logged in
        <button onClick={ this.logOut }>Log Out</button>
      </div>
    );
  }
}

export default ProtectedPage;
