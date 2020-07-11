import React from 'react';
import "../Styles/header.css";
import {Link} from 'react-router-dom'
import axios from "axios";

class Header extends React.Component {

    doLogout = () => {
        const url = "/logout";
        const user_id = {user_id: this.props.user.user_id}
        axios.post(url, user_id)
            .then((res) => {
                this.props.onLogout()
            })
            .catch((err) => {
                console.log("error")
            });
    }


    render() {
        return (
            <header>
                <div className="nav-bar">
                    <div>
                        <Link to="/">Home</Link>
                        <span className="vertical-line"> | </span>
                        <Link to="/about">About</Link>
                        <span className="vertical-line"> | </span>
                        <Link to="/contact">Contact</Link>
                        {this.props.user && this.props.user.role == 'ADMIN' ?
                          <span>
                        <span className="vertical-line"> | </span>
                        <Link to="/manage">Manage</Link>
                          </span> : null}

                    </div>
                    <div className="right-positioned">
                        {this.props.user?
                            <div>
                            Hello {this.props.user.first_name}
                                <button onClick={this.doLogout}>Logout</button>
                            </div>
                            :
                            <Link to="/login">Login</Link>}
                    </div>
                </div>
            </header>
        );
    }

}

export default Header;

