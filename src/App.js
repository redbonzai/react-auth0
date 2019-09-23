import React, { Component } from 'react';
import { Route , Redirect } from 'react-router-dom';
import HomeComponent from './components/HomeComponent';
import ProfileComponent from './components/ProfileComponent';
import NavComponent from './components/NavComponent';
import Auth from './Auth/Auth';
import CallBackComponent from './components/CallBackComponent';
import PublicComponent from './components/PublicComponent';
import PrivateComponent from './components/PrivateComponent';
import CoursesComponent from './components/CoursesComponent';
import PrivateRoute from './components/PrivateRoute';

class App extends Component {

  constructor(props) {
    super(props);
    // App gets access to history object from React Router
    this.auth = new Auth(this.props.history)
  }  

  render() {
    return (
      <>
        <NavComponent auth={this.auth}/>
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
          <Route path='/public' component={PublicComponent} />
          <PrivateRoute path='/profile' component={ProfileComponent} auth={this.auth} />          
          <PrivateRoute path='/private' component={PrivateComponent} auth={this.auth} />
          <PrivateRoute 
            path='/courses' 
            component={CoursesComponent}
            auth={this.auth}
            scopes={['read:courses']} 
          />
        </div>
      </>
    );
  }
}

export default App;
