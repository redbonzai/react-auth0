import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import HomeComponent from './components/HomeComponent';
import ProfileComponent from './components/ProfileComponent';
import NavComponent from './components/NavComponent';
import Auth from './Auth/Auth';
import CallBackComponent from './components/CallBackComponent';

class App extends Component {

  constructor(props) {
    super(props);
    // App gets access to history object from React Router
    this.auth = new Auth(this.props.history)
  } 

  render() {
    return (
      <>
        <NavComponent />
        <div className='body'>
          <Route 
            path='/' 
            exact 
            render={props => <HomeComponent auth={this.auth} {...props} />}
          />
          <Route 
            path='/callback' 
            exact 
            render={props => <CallBackComponent auth={this.auth} {...props} />}
          />
          <Route path='/profile' component={ProfileComponent} />
        </div>
      </>
    );
  }
}

export default App;
