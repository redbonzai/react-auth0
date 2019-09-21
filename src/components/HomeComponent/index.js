import React, { Component } from 'react';

class HomeComponent extends Component {
    render() {
        return (
            <div>
                <h1>Home Page</h1>
                <button onClick={this.props.auth.login}>Login</button>
            </div>
        );
    }
}

export default HomeComponent;