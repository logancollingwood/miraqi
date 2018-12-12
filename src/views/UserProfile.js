import React, { Component } from "react";
import Redirect from "react-router-dom";
import Config from "../Config.js";
import Nav from "../Nav.js";
import Guilds from "../components/Guilds.js";
import Api from "../components/Api.js";
import GuildProfile from "../components/guilds/GuildProfile.js";
import Profile  from "../profile/Profile";
import Provider from "react-redux";
import {connect} from 'react-redux'
import reducer from '../reducers/reducer'
import { createStore } from 'redux'
import { SetUserAction } from "../actions/action";


const store = createStore(reducer);
const mapStateToProps = (state = {}) => {
    console.log(state)
    if (state.loading) {
        return {loading: true}
    }

    return {};
};
class UserProfile extends React.Component {

	constructor(props) {
		super(props);
		const { dispatch } = this.props;
		this.requestUser(dispatch);
	}

	async requestUser(dispatch) {
		let user = await Api.getUser();
		dispatch(SetUserAction(user));
	}


	render() {
		return (
				<div>
					<Nav isHome={false} isRoom={false}/>
						<div className="container-fluid">
							<div className="row justify-content-center main-content">
								<div className="col-md-2 no-padding">
									<Guilds />
								</div>
								<div className="col-md-10 no-padding">
									<Profile />
								</div>
							</div>
					</div>
				</div>
		)
	}
}


export default connect(mapStateToProps)(UserProfile);
