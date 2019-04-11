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
import SocketContext from "../../context/SocketContext";


const mapStateToProps = (state = {}) => {
	console.log(state);
    return {loggedIn: false, loading: state.loading, authorized: state.authorized};
};
class UserProfile extends React.Component {

	static contextType = SocketContext;

	constructor(props, context) {
		super(props);
		console.log(props);
		// this.dispatch  = this.props.dispatch;
		// this.socket = this.props.socket
	}

	render() {
		console.log("props");
		console.log(this.props);
		if (!this.props.authorized && !this.props.loading) {
			return (
				<Redirect to="/" />
			)
		} else {
			return (
				<div>
					<Nav isHome={false} isRoom={false}/>
					<div className={"container-fluid " + styles.mainContent}>
						<div className="row justify-content-center">
							<div className="col-2 no-padding">
								<Guilds />
							</div>
							<div className="col-10 no-padding">
								<Profile />
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
					// <Redirect to="/" />

}


export default connect(mapStateToProps)(UserProfile);
