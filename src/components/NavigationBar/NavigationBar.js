import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <a href="/success">Success</a>
        <a href="/protectedPage">ProtectedPage</a>
        <a href="/login">Login</a>
      </div>
    );
  }
}

export default App;
