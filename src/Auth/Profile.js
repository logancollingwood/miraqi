import React, { Component } from "react";
import Redirect from "react-router-dom";
import LoginForm from "./components/LoginForm.js";
import Config from "../Config.js";
import auth from "./Auth.js";
import Nav from "../Nav.js";
import Guilds from "../components/Guilds.js";
import API from "../components/Api.js";


class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			user: null
		}
	}

	requestUser() {
		API.getUser()
			.then(user => {
				console.log(user);
				this.setState({user: user});
			});
	}
	
	componentDidMount() {
		console.log('fetching');
		this.requestUser();
	}

	render() {
		console.log("re-rendering profile with user: ");
		console.log(this.state.user);
		let readyToRender = this.state.user != null;
		console.log('ready to render: ' + readyToRender);
		return (
			<div>
				<Nav isHome={false} isRoom={false}/>
				<div className="container-fluid">
						{ readyToRender &&
							<div className="row justify-content-center main-content">
								<div className="col-md-2 no-padding">
									<Guilds guilds={this.state.user.guilds} loading={!readyToRender}/>
								</div>
								<div className="col-md-10 no-padding left-half">
									<div>
										{ readyToRender &&
											<p>Hey, {this.state.user.userName}</p>
										}
									</div>
								</div>
							</div>
						}

						{
							!this.state.user &&
								<div className="col-md-12">
									<a href="http://localhost:3001/login/discord"> login </a>
								</div>
						}
						
					</div>
				</div>
		)
	}
}


export default Profile;
