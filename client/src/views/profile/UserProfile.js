import React from "react";
import { Redirect } from "react-router-dom";
import Nav from "../../components/nav/Nav";
import Guilds from "../../components/Guilds";
import Profile  from "../../components/profile/Profile";
import {connect} from 'react-redux';
import styles from "../../components/global/Globals.module.scss";
import SocketContext from "../../context/SocketContext";
import { withRouter } from "react-router";
import SocketApp from "../../SocketApp";



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
		return (
			<SocketApp>
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
			</SocketApp>
		);
	}
}


export default withRouter(connect(mapStateToProps)(UserProfile));
