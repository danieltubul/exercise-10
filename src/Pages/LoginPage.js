import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';


class LoginPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
        this.setState({
            username: null,
            password: null,
            resp: null,
        })
    }


    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    doLogin = () => {
        const url = "/login";
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        axios.post(url, data)
            .then((res) => {
                this.setState({
                    username: '',
                    password: '',
                    resp: "Success: user logged in.",
                });
                // console.log("res from login", res)
                this.props.onLoginSuccess(res.data)
                this.props.history.push('/')

            })
            .catch((err) => {
                this.setState({
                    resp: "Error: failed to login user."
                });
            });
    }

    onEnter = (e) => {
        if (e.key == 'Enter' && this.state.username && this.state.password) {
            this.doLogin()
        }
    }


    render() {
        return (
            <div>
                <br/><br/><br/><br/>
                <div align="center">
                    Username: <input type="text" onKeyDown={this.onEnter} value={this.state.username} onChange={this.handleUsernameChange}></input><br/>
                    Password: <input type="password" onKeyDown={this.onEnter} value={this.state.password} onChange={this.handlePasswordChange}></input><br/>
                    <button onClick={this.doLogin}>Login</button><br/><br/>
                    <Link to="/register">I don't have an account</Link>
                </div>
                <div>
                    {this.state.resp ? this.state.resp : null}
                </div>
            </div>
        );
    }

}

export default LoginPage;