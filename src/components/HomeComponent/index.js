import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomeComponent extends Component {
    render() {
        const { isUserAuthenticated, login } = this.props.auth
        return (
            <div>
                <h1>Home Page</h1>
                { 
                    isUserAuthenticated()
                    ? <Link to='/profile'>View profile</Link> 
                    : <button onClick={login}>Login</button>
                }
                
            </div>
        );
    }
}

export default HomeComponent;