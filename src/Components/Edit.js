import React from 'react';
import "../Styles/header.css";
import axios from "axios";
import PostForm from "./PostForm";


class Edit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            post: null,
            post_id: null
        };
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            post_id: id,

        })
        console.log(this.props.user)

        axios.get(`/posts/${id}`).then(res => {
            this.setState({
                post: res.data,
            });
        })

    }

    handleSubmit = (data) => { // create new endpoint
        data['id'] = this.state.post_id
        console.log(data)
        axios.post('/edit', data).then(res => {
            this.props.history.push('/')

        })
    }

    render() {
        if(!this.state.post) return null
        return (
            <div>
                <h1>Edit post</h1>
                <PostForm  handleSubmit={this.handleSubmit} title={this.state.post.title} content={this.state.post.content} author={this.state.post.author} buttonText={"Edit"}/>
            </div>
        )
    }
}

export default Edit;
