import React, { Component } from "react";
import Redirect from "react-router-dom";
import LoginForm from "./components/LoginForm.js";
import Config from "../Config.js";
import auth from "./Auth.js";


class Login extends React.Component {
	state = {
		redirectToReferrer: false
	}

	login = (data) => {
		console.log('Logging in ' + data.username);
		fetch(Config.WEB_HOST + 'login/discord', {
			method: 'GET',
			credentials: 'include',
			 mode: 'no-cors'
		})
		.then((response) => {
			console.log(response);
			if (response.status === 200) {
				console.log(response);
				auth.authenticate(() => {
					this.setState({ redirectToReferrer: true })
				});
			}
		})
		.catch((err) => {
			console.log('Error logging in.', err);
		});
	}

	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } }
		const { redirectToReferrer } = this.state
		
		if (redirectToReferrer) {
			return (
				<Redirect to={from}/>
			)
		}
		
		return (
			<div>
				<p>You must log in to view the page at {from.pathname}</p>
				<LoginForm onLogin={this.login} />
			</div>
		)
	}
}


export default Login;
