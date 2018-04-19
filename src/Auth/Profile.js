import React, { Component } from "react";
import Redirect from "react-router-dom";
import LoginForm from "./components/LoginForm.js";
import Config from "../Config.js";
import auth from "./Auth.js";
import Nav from "../Nav.js";
import Guilds from "../components/Guilds.js";


class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			user: null
		}
	}

	componentDidMount() {
		console.log('fetching');
		fetch(Config.WEB_HOST + 'user/info',
			{
				method: 'GET',
				credentials: 'include',
				// mode: 'no-cors'
			}
		)
		.then(response => {
			if(response.status == 402) {
				console.log('caught 402');
			}
			return response.json();
		})
		.then(json => {
			this.setState({user: json});
			console.log(json);
		});

	}

	render() {
		console.log("re-rendering profile with user: ");
		console.log(this.state.user);
		let readyToRender = this.state.user != null;
		return (
			<div>
				<Nav isHome={false} isRoom={true} user={this.state.user}/>
				<div className="container-fluid">
						{ readyToRender &&
							<div className="row justify-content-center main-content">
								<div className="col-md-3 no-padding">
									<Guilds guilds={this.state.user.guilds} />
								</div>
								<div className="col-md-9 no-padding left-half">
									<div>
										{ readyToRender &&
											<p>Hey, {this.state.user.userName}</p>
										}
									</div>
								</div>
							</div>
						}

						{
							!readyToRender &&
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
