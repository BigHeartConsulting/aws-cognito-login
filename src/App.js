import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import SuccessPage from './SuccessPage';
import ProtectedPage from './ProtectedPage';
import ProtectedRoute from './ProtectedRoute';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <ProtectedRoute path="/success" component={SuccessPage}/>
          <ProtectedRoute path="/protectedPage" component={ProtectedPage}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
