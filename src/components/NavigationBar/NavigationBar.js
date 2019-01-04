import React, { Component } from 'react';
import { getLoggedInUser, isUserLoggedIn } from '../../utils/userUtils'

import './NavigationBar.css';

class App extends Component {
  logOut() {
    const cognitoUser = getLoggedInUser();
    cognitoUser.signOut();
    window.location.reload();
  }

  componentDidMount() {
    console.log("mounted");
  }

  showLoginLogout() {
    const cognitoUser = getLoggedInUser();

    if(isUserLoggedIn(cognitoUser)) {
        return <button className="NavigationBar-item" onClick={this.logOut}>Log out</button>
    }

    return <a className="NavigationBar-item" href="/login">Login</a>
  }

  render() {
    return (
      <div className="NavigationBar">
        <a className="NavigationBar-item" href="/welcome">Welcome</a>
        <a className="NavigationBar-item" href="/protectedPage">ProtectedPage</a>
        { this.showLoginLogout() }
      </div>
    );
  }
}

export default App;
