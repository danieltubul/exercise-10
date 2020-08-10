import React from "react";
import axios from "axios";
// import {Link} from "react-router-dom";

class PostPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            post: [],
            comments: [],
            post_id: undefined,
            comment: undefined,
            author: '',

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
                comments: res.data.comments,
            });
        })

    }

    handleCommentChange = (e) => {
        this.setState({
            comment: e.target.value,
        })
    }

    handleSubmit = () => {
        const data = {
            post_id: this.state.post_id,
            comment: this.state.comment,
            author: this.props.user.first_name,
        }
        axios.post('/comments', data).then(res => {
            const new_comment = res.data;
            this.setState({
                comments: this.state.comments.concat(new_comment),
                comment: ''
            });
        })
    }

    onEnter = (e) => {
        if (e.key == 'Enter') {
            this.handleSubmit()
        }
    }

    render() {
        return (
            <div>
                <h1>{this.state.post.title}</h1>
                <p style={{ whiteSpace: 'pre-wrap' }}>{this.state.post.content}</p>
                <p>
                    I want to show comments here: <br/><br/>
                   {this.state.comments.map(function (comment){
                        return <Comment
                            {...comment}
                            />})}
                </p>
                {this.props.user?
                <p>
                    <input type="text" onKeyDown={this.onEnter} value={this.state.comment} placeholder="comment" size="54"
                           onChange={this.handleCommentChange}></input>
                    <br/><br/>
                    <input type="submit"  value="Post comment" onClick={this.handleSubmit}></input>
                </p>
                    : null}

            </div>
        )
    }
}

function Comment(props) {
    return (
        <div className="post-container">
            <div className="post">
                <label className="post-title">
                     {props.comment}
                </label>

                <label className="post-footer">
                    Published at {props.published_at} by {props.author}
                </label>
            </div>
        </div>
    );
}
export default PostPage;


