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
          <Route 
            path='/profile' 
            render={props => 
              this.auth.isUserAuthenticated() 
                ? <ProfileComponent auth={this.auth} {...props} /> 
                : <Redirect to='/' />
            } 
          />
          <Route path='/public' component={PublicComponent} />
          <Route 
            path='/private' 
            render={props => 
              this.auth.isUserAuthenticated() 
                ? ( <PrivateComponent auth={this.auth} {...props} /> )
                : ( this.auth.login() )
            } 
          />
          <Route 
            path='/courses' 
            render={props => 
              this.auth.isUserAuthenticated() && this.auth.userHasScopes(['read:courses']) 
                ? ( <CoursesComponent auth={this.auth} {...props} /> )
                : ( this.auth.login() )
            } 
          />
        </div>
      </>
    );
  }
}

export default App;
