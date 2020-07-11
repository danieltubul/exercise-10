import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'


class Manage extends React.Component {

    render() {
        if(!(this.props.user && this.props.user.role == 'ADMIN'))
            return <Redirect to='/login'  />
        return (
            <div>
            <br/><br/><br/><br/>
                <Link to="/add-post">Create a new post</Link>
                <br/>
                <Link to="/edit-posts"> Edit/delete existing posts</Link>
            </div>
        );

    }
}

export default Manage;