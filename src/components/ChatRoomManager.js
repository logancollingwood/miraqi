import React from "react";
import Chat from "./chat/Chat";
import DjContainer from "./DjContainer.js";
import Api from "../components/Api.js";
import Guilds from "../components/Guilds.js";

class ChatRoomManager extends React.Component {

	constructor(props) {
		super(props);
		this.socket = this.props.socket;
		console.log(this.props);
		this.state = {
			loading: true,
			room: null,
			user: null,
		}
	}

	
	async requestUser() {
		let user = await Api.getUser();
		this.setState({user: user.profile});
	}
	
	componentDidMount() {
		const updateRoom = data => {
			this.setState({loading: false, room: data});
		};
		this.socket.on('room', function(data) {
			console.log('received room publish');
			console.log(data);
			updateRoom(data);
		});
		this.requestUser();
	}


    render() {
        return (
			<div className="container-fluid">
				<div className="row justify-content-center main-content">
					<div className="col-md-2 no-padding">
						<Guilds loading={this.state.loading} user={this.state.user} currentRoom={this.state.room}/>
					</div>
					<div className="col-md-7 no-padding">
						<DjContainer loading={this.state.loading} room={this.state.room} socket={this.socket}/>
					</div>
					<div className="col-md-3 no-padding">
						<Chat loading={this.state.loading} user={this.state.user} socket={this.socket} room={this.state.room}/>
					</div>
				</div>
			</div>
        );
    }
}

export default ChatRoomManager;