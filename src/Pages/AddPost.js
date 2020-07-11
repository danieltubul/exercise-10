import React from 'react';
import axios from 'axios';
import PostForm from "../Components/PostForm";

class AddPost extends React.Component {


    handleSubmit = (data) => {
        axios.post('/posts', data).then(res => {
            this.props.history.push('/')

        })
    }

    render() {
        if(!this.props.user) return null
        return (
            <div>
                <h1>Create new post</h1>
                    <PostForm handleSubmit={this.handleSubmit} buttonText={"Create Post"} author={this.props.user.first_name}/>
            </div>
        );

    }
}

export default AddPost;