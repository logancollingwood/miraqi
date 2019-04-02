import React from "react";
import { Redirect } from "react-router-dom";
import Nav from "../../components/nav/Nav.js";
import Guilds from "../../components/Guilds.js";
import API from "../../components/Api";
import Profile  from "../../components/profile/Profile";
import {connect} from 'react-redux';
import { SetUserAction } from "../../actions/action";
import styles from "../../components/global/Globals.module.scss";


const mapStateToProps = (state = {}) => {

    return {loggedIn: false, loading: true};
};
class UserProfile extends React.Component {

	constructor(props) {
		super(props);
		this.dispatch  = this.props.dispatch;
		this.state = {
			loading: true,
			loggedIn: false
		}
	}

	async componentDidMount() {
		const self = this;
		try {
			const user = await API.getUser();
			self.setState({
				loggedIn: true,
				loading: false
			});
			self.dispatch(SetUserAction(user));
		} catch (err) {
			console.log(err);
			console.log('get user failed');
			self.setState({
				loggedIn: false,
				loading: false
			});
		}
	}

	render() {
		console.log('render');
		console.log(this.state);
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
