import React, { Component } from 'react';

class CoursesComponent extends Component {
    state = {
        courses: []
    }
    
    componentDidMount() {
        
        fetch('/course', {
            headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        })
            .then(response => {
                if (response.ok) return response.json()
                throw new Error('Network response was a failure');
            })
            .then(response => this.setState({ courses: response.courses }))
            .catch(error => this.setState({ message: error.message }))
        
        // fetch('/admin', {
        //     headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}`}
        // })
        //     .then(response => {
        //         if (response.ok) return response.json()
        //         throw new Error('Network response was a failure');
        //     })
        //     .then(response => console.log('response: ', response))
        //     .catch(error => this.setState({ message: error.message }))
    }

    render() {
        return (
            <div>
                <ul>
                    {this.state.courses.map(course => {
                        return <li key={course.id}>{course.title}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default CoursesComponent;