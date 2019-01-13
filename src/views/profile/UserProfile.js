import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Config from "../../Config.js";
import Nav from "../../components/nav/Nav.js";
import Guilds from "../../components/Guilds.js";
import Api from "../../components/Api.js";
import GuildProfile from "../../components/guilds/GuildProfile.js";
import Profile  from "../../components/profile/Profile";
import Provider from "react-redux";
import {connect} from 'react-redux'
import reducer from '../../reducers/reducer'
import { createStore } from 'redux'
import { SetUserAction } from "../../actions/action";
import styles from "../../components/global/Globals.module.scss";


const store = createStore(reducer);
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

	componentDidMount() {
		const self = this;
		this.requestUser()
			.then(user => {
				if (!user) {
					self.setState({
						loggedIn: false,
						loading: false
					});
				} else {
					self.setState({
						loggedIn: true,
						loading: false
					});
					self.dispatch(SetUserAction(user));
				}
			}).catch(err => {console.log(err) });
	}

	async requestUser() {
		let user = await Api.getUser();
		return user;
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
