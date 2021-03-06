import React from "react";
import Nav from "../../components/nav/Nav";
import Guilds from "../../components/Guilds";
import Profile  from "../../components/profile/Profile";
import {connect} from 'react-redux';
import styles from "../../components/global/Globals.module.scss";
import globals from "../../styles/main.module.scss";
import SocketContext from "../../context/SocketContext";
import { withRouter } from "react-router";



const mapStateToProps = (state = {}) => {
	console.log(state);
    return {loggedIn: false, loading: state.loading, authorized: state.authorized};
};
class UserProfile extends React.Component {

	static contextType = SocketContext;

	constructor(props, context) {
		super(props);
	}

	render() {
		return (
			<div className={globals.root_container}>
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


export default withRouter(connect(mapStateToProps)(UserProfile));
