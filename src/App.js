import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import HomeComponent from './components/HomeComponent';
import ProfileComponent from './components/ProfileComponent';
import NavComponent from './components/NavComponent';
import Auth from './Auth/Auth';
import AuthContext from './Auth/AuthContext';
import CallBackComponent from './components/CallBackComponent';
import PublicComponent from './components/PublicComponent';
import PrivateComponent from './components/PrivateComponent';
import CoursesComponent from './components/CoursesComponent';
import PrivateRoute from './components/PrivateRoute';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // App gets access to history object from React Router
      auth: new Auth(this.props.history)
    }
  }  

  render() {
    const { auth } = this.state
    return (
      <AuthContext.Provider value={auth}>
        <>
          <NavComponent auth={auth}/>
          <div className='body'>
            <Route 
              path='/' 
              exact 
              render={props => <HomeComponent auth={auth} {...props} />}
            />
            <Route 
              path='/callback' 
              exact 
              render={props => <CallBackComponent auth={auth} {...props} />}
            />
            <Route path='/public' component={PublicComponent} />
            <PrivateRoute path='/profile' component={ProfileComponent} />          
            <PrivateRoute path='/private' component={PrivateComponent} />
            <PrivateRoute 
              path='/courses' 
              component={CoursesComponent}
              scopes={['read:courses']} 
            />
          </div>
        </>
      </AuthContext.Provider>
    );
  }
}

export default App;
