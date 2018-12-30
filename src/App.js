import React, { Component } from 'react';
import './App.css';
var cognito = require('amazon-cognito-identity-js');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      newPasswordRequired: false,
      error: '',
    }
  }

  onSubmit(e) {
    e.preventDefault();

    var poolData = {
      UserPoolId : process.env.REACT_APP_POOL_ID, // your user pool id here
      ClientId : process.env.REACT_APP_CLIENT_ID // your app client id here
    };

    var userPool = new cognito.CognitoUserPool(poolData);
    var userData = {
        Username : this.state.username, // your username here
        Pool : userPool
    };

    var authenticationData = {
      Username : this.state.username,
      Password : this.state.password,
    };

    var authenticationDetails = new cognito.AuthenticationDetails(authenticationData);

    var cognitoUser = new cognito.CognitoUser(userData);

    // This is needed as the react context is needed for setting state in newPasswordRequired,
    // and the context of cognitoUser.authenticateUser is needed for the onFailure callback
    let localContext = this;

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        sessionStorage.setItem('jwt', result.getAccessToken().getJwtToken());
      },

      onFailure: function(err) {
          localContext.setState({error: err.message});
      },

      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // the api doesn't accept this field back
        delete userAttributes.email_verified;

        // Get these details and call
        localContext.setState({newPasswordRequired: true});
        if(localContext.state.newPassword && localContext.state.confirmNewPassword) {
          cognitoUser.completeNewPasswordChallenge(localContext.state.newPassword, userAttributes, this);
        }
      }
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      error: "",
    });
  }

  hasRequiredFields() {
    if (this.state.newPasswordRequired) {
      return this.state.newPassword && 
        this.state.confirmNewPassword && 
        this.state.newPassword === this.state.confirmNewPassword &&
        this.state.username && this.state.password;
    }
    return this.state.username && this.state.password;
  }

  showNewPasswordFields() {
    if (this.state.newPasswordRequired) {
      return <div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input name="newPassword" onChange={this.handleChange.bind(this)} type="password" className="form-control" placeholder="Your new password"/>
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input name="confirmNewPassword" onChange={this.handleChange.bind(this)} type="password" className="form-control" placeholder="Your new password"/>
        </div>
      </div>
    }

    return <div/>
  }

  showPasswordsMustMatch() {
    if (this.state.newPassword !== this.state.confirmNewPassword) {
      return <div>
        Passwords must match
      </div>
    }

    return <div/>
  }

  showError() {
    if (this.state.error) {
      return <div>
        { this.state.error }
      </div>
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.onSubmit.bind(this)}>
            <h2 className="text-center mb-4">Sign In</h2>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input name="username" onChange={this.handleChange.bind(this)} className="form-control" placeholder="Your username"/>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input name="password" onChange={this.handleChange.bind(this)} type="password" className="form-control" placeholder="Your password"/>
            </div>

            { this.showNewPasswordFields() }
            { this.showPasswordsMustMatch() }
            { this.showError() }

            <button type="submit" disabled={!this.hasRequiredFields()} className="btn btn-primary mt-3 w-100">Sign In</button>
          </form>
        </header>
      </div>
    );
  }
}

export default App;
