import React from 'react';
import axios from "axios";
import './Styles/App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link} from 'react-router-dom'

import Header from "./Components/Header";
import AboutMe from "./Pages/AboutMe";
import ContactMe from "./Pages/ContactMe";
import HomePage from "./Pages/HomePage";
import Manage from "./Pages/Manage";
import PostPage from "./Pages/PostPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage"
import AddPost from "./Pages/AddPost";
import EditPosts from "./Pages/EditPosts"
import Edit from "./Components/Edit";

class App extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            user: null,

        }
    }

    setUser = (data) => {
        this.setState({
            user: data
        })
    }

    setLoginToFalse =(e) =>{
        this.setState({
            user: null
        })
    }

    componentDidMount() {
        axios.get('/user')
            .then((res) => {
            this.setUser(res.data)
            })
            .catch((err) => {

            });
        }


    render (){
        return (
            <div className="app-header">
                <Router>
                    <Header user={this.state.user}  onLogout={this.setLoginToFalse}/>
                    <Switch>
                        <Route path ="/register" component={RegisterPage}/>
                        <Route path="/login" component={(props) => <LoginPage onLoginSuccess={this.setUser} {...props} />}/>
                        <Route exact path="/post/:id" render={(props) => <PostPage {...props} user={this.state.user} />} />
                        <Route path="/about" component={AboutMe}/>
                        <Route path="/contact" component={ContactMe}/>
                        <Route path="/manage" render={(props) => <Manage {...props} user={this.state.user}/>}/>
                        <Route path="/edit/:id" render={(props) => <Edit {...props} user={this.state.user} />}/>
                        <Route path="/add-post" render={(props) => <AddPost {...props} user={this.state.user} />}/>
                        <Route user={this.state.user} path="/edit-posts" component={EditPosts}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
