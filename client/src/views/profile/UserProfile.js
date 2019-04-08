import React from "react";
import { Redirect } from "react-router-dom";
import Nav from "../../components/nav/Nav.js";
import Guilds from "../../components/Guilds.js";
import API from "../../components/Api";
import Profile  from "../../components/profile/Profile";
import {connect} from 'react-redux';
import { SetUserAction, NotAuthorizedAction } from "../../actions/action";
import styles from "../../components/global/Globals.module.scss";
import io from "socket.io-client";
import Config from "../../Config.js";


const mapStateToProps = (state = {}) => {

    return {loggedIn: false, loading: true, authorized: state.authorized};
};
class UserProfile extends React.Component {

	constructor(props) {
		super(props);
		console.log(this.props);
		this.dispatch  = this.props.dispatch;
		this.socket = this.props.socket
		this.state = {
			loading: true,
			loggedIn: false
		}
		let self = this;
		this.socket.emit('echo_auth');
		this.socket.on('auth_credential', function(data, err) {
			self.setState({
				loggedIn: true,
				loading: false
			});
			self.dispatch(SetUserAction(data));
		})
		this.socket.on('disconnect', function() {
			self.dispatch(NotAuthorizedAction());
		})
		this.socket.on('not_auth', function() {
			console.log('not_auth');
			self.dispatch(NotAuthorizedAction());
		})
	}

	render() {
		if (!this.state.loading && !this.state.loggedIn) {
			return (
				<Redirect to="/" />
			)
		} else {
			return (
					<div>
						<Nav isHome={false} isRoom={false}/>
						<div className={"container-fluid " + styles.mainContent}>
							<div className="row justify-content-center main-content">
								<div className="col-2 no-padding">
									<Guilds />
								</div>
								<div className="col-10 no-padding">
									<Profile />
								</div>
							</div>
						</div>
					</div>
			)
		}
	}
}


export default connect(mapStateToProps)(UserProfile);
