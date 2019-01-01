import React, { Component } from 'react';
var cognito = require('amazon-cognito-identity-js');

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      newPasswordRequired: false,
      error: '',
      isResettingPassword: false,
      verificationCode: '',
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

    if(this.state.isResettingPassword) {      
      cognitoUser.confirmPassword(this.state.verificationCode, this.state.password, {
        
        onSuccess: function (result) {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                const returnLocation = localContext.props.location.state ? localContext.props.location.state.referrer : '/success'; 
                localContext.props.history.push(returnLocation || "/success");
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
              delete userAttributes.phone_number_verified;
      
              // Get these details and call
              localContext.setState({newPasswordRequired: true});
              if(localContext.state.newPassword && localContext.state.confirmNewPassword) {
                cognitoUser.completeNewPasswordChallenge(localContext.state.newPassword, userAttributes, this);
              }
            }
          });
        },

        onFailure: function(err) {
            localContext.setState({error: err.message});
        },
      });
    } else {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const returnLocation = localContext.props.location.state ? localContext.props.location.state.referrer : '/success'; 
            localContext.props.history.push(returnLocation || "/success");
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
          delete userAttributes.phone_number_verified;
  
          // Get these details and call
          localContext.setState({newPasswordRequired: true});
          if(localContext.state.newPassword && localContext.state.confirmNewPassword) {
            cognitoUser.completeNewPasswordChallenge(localContext.state.newPassword, userAttributes, this);
          }
        }
      });
    }
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

  showVerificationField() {
    if(this.state.isResettingPassword) {
      return <div className="form-group">
        <label htmlFor="verificationCode">Verification Code</label>
        <input name="verificationCode" onChange={this.handleChange.bind(this)} type="password" className="form-control" placeholder="Your verification code"/>
      </div>
    }
  }

  forgotPassword(e) {
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

    var cognitoUser = new cognito.CognitoUser(userData);
    let localContext = this;

    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        localContext.setState({error: "You have successfully reset you password, please log in"});
      },

      onFailure: function(err) {
        localContext.setState({error: err.message});
      },

      inputVerificationCode() {
        localContext.setState({isResettingPassword: true});
      }
  });
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

            { this.showVerificationField() }

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input name="password" onChange={this.handleChange.bind(this)} type="password" className="form-control" placeholder="Your password"/>
            </div>

            { this.showNewPasswordFields() }
            { this.showPasswordsMustMatch() }
            { this.showError() }

            <button type="submit" disabled={!this.hasRequiredFields()} className="btn btn-primary mt-3 w-100">Sign In</button>
            <button onClick={this.forgotPassword.bind(this)}>Forgot Password?</button>
          </form>
        </header>
      </div>
    );
  }
}

export default LoginPage;
