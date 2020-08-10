import React from 'react';
import axios from 'axios';
import  { Redirect } from 'react-router-dom'




class EditPosts extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        axios.get('/posts').then(res => {
            this.setState({
                posts: res.data,
            });
            console.log(this.state.posts)
        })
    }

    deletePost = (id) => {
        console.log(id)
        if(window.confirm("Are you sure you?")){
            axios.delete(`/posts/${id}`).then(res => {
                const data = res.data;
                this.setState({
                    posts: data,
                    });
            })
        }
        else {
            console.log("dont")
            return
        }
    }

    editPost = (id) => {
        return
    }

    render() {
        if(!(this.props.user && this.props.user.role == 'ADMIN'))
            return <Redirect to='/login'  />
        else return (<div>
            <ul>
            {this.state.posts.map(post => <li>
                {post.title}
                <button onClick={() => this.deletePost(post.id)}>delete</button>
                <button onClick={()=> this.props.history.push(`edit/${post.id}`)}>edit</button>
            </li>)}
            </ul>
        </div>
        );}
    }







export default EditPosts;