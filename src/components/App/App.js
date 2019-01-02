import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import NavigationBar from '../../components/NavigationBar/NavigationBar'
import LoginPage from '../../pages/LoginPage';
import SuccessPage from '../../pages/SuccessPage';
import ProtectedPage from '../../pages/ProtectedPage';
import ProtectedRoute from '../../utils/ProtectedRoute';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={LoginPage}/>
            <Route exact path="/login" component={LoginPage}/>
            <ProtectedRoute path="/success" component={SuccessPage}/>
            <ProtectedRoute path="/protectedPage" component={ProtectedPage}/>
          </Switch>
        </Router>
        
        <NavigationBar/>
      </div>
    );
  }
}

export default App;
