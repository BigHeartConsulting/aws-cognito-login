import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import NavigationBar from '../../components/NavigationBar/NavigationBar'
import LoginPage from '../../pages/LoginPage';
import WelcomePage from '../../pages/WelcomePage';
import ProtectedPage from '../../pages/ProtectedPage';
import ProtectedRoute from '../../utils/ProtectedRoute';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavigationBar/>

        <Router>
          <Switch>
            <Route exact path="/" component={WelcomePage}/>
            <Route exact path="/login" component={LoginPage}/>
            <Route path="/welcome" component={WelcomePage}/>
            <ProtectedRoute path="/protectedPage" component={ProtectedPage}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
