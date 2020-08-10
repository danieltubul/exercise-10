import React from 'react';
import axios from 'axios';
import Edit from '../Components/Edit'

class PostForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title || undefined,
            content: props.content || undefined,
            author: props.author || undefined,
        };
    }

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value,
        })
    }
    handleContentChange = (e) => {
        this.setState({
            content: e.target.value,
        })
    }

    handleSubmit = () => {
        this.props.handleSubmit(this.state)
    }

    render() {
        return (
            <div>
                <p>
                    <br/>
                    <input type="text" value={this.state.title} placeholder="Post title goes here..." size="54"
                           onChange={this.handleTitleChange}></input>
                    <br/><br/>
                    <textarea rows="8" cols="50" maxLength="8000" value={this.state.content} multiline={true} placeholder="Post content goes here..." onChange={this.handleContentChange}></textarea>
                    <br/><br/>
                    <input type="text" value={this.props.author} size="54" readOnly={this.props.author}></input>
                    <br/><br/>
                </p>
                <button onClick={this.handleSubmit}>{this.props.buttonText}</button>
            </div>
        );

    }
}

export default PostForm;