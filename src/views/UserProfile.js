import React, { Component } from "react";
import Redirect from "react-router-dom";
import Config from "../Config.js";
import Nav from "../Nav.js";
import Guilds from "../components/Guilds.js";
import Api from "../components/Api.js";
import GuildProfile from "../components/guilds/GuildProfile.js";
import Profile from "../profile/Profile.js";

class UserProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			user: null
		}
	}

	async requestUser() {
		let user = await Api.getUser();
		this.setState({user: user.profile});
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
									<Guilds loading={!readyToRender} user={this.state.user} currentRoom={this.state.room}/>
								</div>
								<div className="col-md-10 no-padding">
										{ readyToRender &&
											<Profile user={this.props.user} />
										}
								</div>
							</div>
						}
					</div>
				</div>
		)
	}
}


export default UserProfile;
