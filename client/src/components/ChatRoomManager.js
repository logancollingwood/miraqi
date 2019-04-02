import React from "react";
import { Redirect } from "react-router";
import Chat from "./chat/Chat";
import DjContainer from "./DjContainer.js";
import Guilds from "../components/Guilds.js";
import {UpdateRoomAction} from "../actions/action";
import {connect} from 'react-redux';

const mapStateToProps = (state = {}) => {
	console.log(state)
    return {messages: state.messages, username: state.user.name, authorized: state.authorized};
};

class ChatRoomManager extends React.Component {

	constructor(props) {
		super(props);
		const {dispatch} = this.props;
		this.socket = this.props.socket;
		this.socket.on('initialize', function(data) {
			console.log('received room initialize');
			console.log(data);
			dispatch(UpdateRoomAction(data));
		});

		this.state = {
			loading: true,
			redirect: null,
			room: null,
			user: null,
		}
	}

    render() {
		if (!this.props.authorized) {
			console.log(`redirecting to : /`);
			return (
				<Redirect to={'/'} />
			)
		}
        return (
			<div>
				<div className="row justify-content-center">
					<div className="col-2 no-padding">
						<Guilds/>
					</div>
					<div className="col-7 no-padding">
						<DjContainer loading={this.state.loading} room={this.state.room} socket={this.socket}/>
					</div>
					<div className="col-3 no-padding">
						<Chat loading={this.state.loading} user={this.state.user} socket={this.socket} room={this.state.room}/>
					</div>
				</div>
			</div>
        );
    }
}

export default connect(mapStateToProps)(ChatRoomManager);