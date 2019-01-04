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
      <h2>
        You can only get to this page if you are logged in
      </h2>
    );
  }
}

export default ProtectedPage;
