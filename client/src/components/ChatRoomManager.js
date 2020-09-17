import React from "react";
import { Redirect } from "react-router";
import Chat from "./chat/Chat";
import DjContainer from "./dj/DjContainer";
import Guilds from "../components/Guilds.js";
import {UpdateRoomAction} from "../actions/action";
import {connect} from 'react-redux';
import { withRouter } from "react-router";
import SocketContext from "../context/SocketContext";
import globals from "../styles/main.module.scss"

const mapStateToProps = (state = {}) => {
	console.log(state)
    return {messages: state.messages, username: state.user.name, authorized: state.authorized, loading: state.loading};
};

class ChatRoomManager extends React.Component {

	static contextType = SocketContext;

	constructor(props, context) {
		super(props);
		const {dispatch} = this.props;
		this.socket = context;
		this.socket.on('initialize', function(data) {
			console.log('received room initialize');
			console.log(data);
			dispatch(UpdateRoomAction(data));
		});

		this.state = {
			redirect: null,
			room: null,
			user: null,
		}
	}

    render() {
		if (!this.props.authorized && !this.props.loading) {
			console.log(`redirecting to : /`);
			return (
				<Redirect to={'/'} />
			)
		}
        return (
				<div className="row justify-content-center">
					<div className={"d-none d-md-block col-md-2 no-padding " + globals.guilds_container}>
						<Guilds/>
					</div>
					<div className="col-md-7 no-padding">
						<DjContainer loading={this.state.loading} room={this.state.room} socket={this.socket}/>
					</div>
					<div className="d-none d-md-block col-md-3 no-padding">
						<Chat loading={this.state.loading} user={this.state.user} socket={this.socket} room={this.state.room}/>
					</div>
				</div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(ChatRoomManager));