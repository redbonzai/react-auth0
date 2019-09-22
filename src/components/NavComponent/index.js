import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavComponent extends Component {
    render() {
        const { isUserAuthenticated, login, logout } = this.props.auth
        return (
            <nav>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        {isUserAuthenticated() ? <Link to='/profile'>Profile</Link> : ''}                        
                    </li>
                    <li>
                        <Link to='/public'>Public</Link>
                    </li>
                    <li>
                        {isUserAuthenticated() && (<Link to='/private'>Private</Link>)}
                    </li>
                    <li>
                        <button onClick={ isUserAuthenticated() ? logout : login }>
                            { isUserAuthenticated() ? 'Logout' : 'Login' }
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default NavComponent;