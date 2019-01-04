import React, { Component } from 'react';
const cognito = require('amazon-cognito-identity-js');

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      error: '',
      verificationCode: '',
      newPasswordRequired: false,
      isResettingPassword: false,
    }
  }

  getCognitoUser() {
    const poolData = {
      UserPoolId : process.env.REACT_APP_POOL_ID, // your user pool id here
      ClientId : process.env.REACT_APP_CLIENT_ID // your app client id here
    };

    const userPool = new cognito.CognitoUserPool(poolData);
    const userData = {
        Username : this.state.username, // your username here
        Pool : userPool
    };

    return new cognito.CognitoUser(userData);
  }

  onSubmit(e) {
    e.preventDefault();

    const cognitoUser = this.getCognitoUser();

    if(this.state.isResettingPassword) {      
      cognitoUser.confirmPassword(this.state.verificationCode, this.state.password, {
        onSuccess: function () {
          this.logIn(cognitoUser);
        }.bind(this),

        onFailure: function(err) {
            this.setState({error: err.message});
        }.bind(this),
      });
    } else {
      this.logIn(cognitoUser);
    }
  }

  logIn(cognitoUser) {
    const authenticationData = {
      Username : this.state.username,
      Password : this.state.password,
    };

    const authenticationDetails = new cognito.AuthenticationDetails(authenticationData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: this.handleLoginSuccess.bind(this),

      onFailure: this.handleLoginFailure.bind(this),

      newPasswordRequired: function(userAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // the api doesn't accept these fields back
        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;

        this.setState({newPasswordRequired: true});

        if (this.state.newPassword && this.state.confirmNewPassword) {
          cognitoUser.completeNewPasswordChallenge(this.state.newPassword, userAttributes, {
            onSuccess: this.handleLoginSuccess.bind(this),
            onFailure: this.handleLoginFailure.bind(this),
          });
        }
      }.bind(this)
    });
  }

  handleLoginSuccess() {
    const returnLocation = this.props.location.state ? this.props.location.state.referrer : '/protectedPage'; 
    
    window.location = returnLocation;
  }

  handleLoginFailure(err) {
    this.setState({error: err.message});
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

  forgotPassword(e) {
    e.preventDefault();

    const cognitoUser = this.getCognitoUser();

    cognitoUser.forgotPassword({
      onSuccess: function () {
        this.setState({error: "You have successfully reset you password, please log in"});
      }.bind(this),

      onFailure: function(err) {
        this.setState({error: err.message});
      }.bind(this),

      inputVerificationCode: function() {
        this.setState({isResettingPassword: true});
      }.bind(this)
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
          <input name="newPassword" onChange={ this.handleChange.bind(this) } type="password" className="form-control" placeholder="Your new password"/>
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input name="confirmNewPassword" onChange={ this.handleChange.bind(this) } type="password" className="form-control" placeholder="Your new password"/>
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
        <input name="verificationCode" onChange={ this.handleChange.bind(this) } type="password" className="form-control" placeholder="Your verification code"/>
      </div>
    }
  }

  showForgotPasswordButton() {
    if(!this.state.isResettingPassword) {
      return <button onClick={ this.forgotPassword.bind(this) }>Forgot Password?</button>
    }
  }

  render() {
    return (
      <div>
        <header className="App-header">
          <form onSubmit={this.onSubmit.bind(this)}>
            <h2 className="text-center mb-4">Sign In</h2>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input name="username" onChange={ this.handleChange.bind(this) } className="form-control" placeholder="Your username"/>
            </div>

            { this.showVerificationField() }

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input name="password" onChange={ this.handleChange.bind(this) } type="password" className="form-control" placeholder="Your password"/>
            </div>

            { this.showNewPasswordFields() }
            { this.showPasswordsMustMatch() }
            { this.showError() }

            <button type="submit" disabled={ !this.hasRequiredFields() } className="btn btn-primary mt-3 w-100">{ this.state.isResettingPassword ? "Reset Password" : "Sign In" }</button>
            
            { this.showForgotPasswordButton() }
          </form>
        </header>
      </div>
    );
  }
}

export default LoginPage;
