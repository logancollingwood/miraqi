import React from "react";
import Chat from "./Chat";
import io from "socket.io-client";
import Config from "../Config.js";
import DjContainer from "./DjContainer.js";

class ChatRoomManager extends React.Component {

	constructor(props) {
		super(props);
		this.socket = io(Config.SOCKET_API_HOST);
	}

	componentDidMount() {
	}


    render() {		
        return (
			<div className="container-fluid">
				<div className="row justify-content-center main-content">
					<DjContainer loading={this.props.loading} room={this.props.currentRoom} socket={this.socket}/>
					<Chat loading={this.props.loading} socket={this.socket} room={this.props.currentRoom}/>
				</div>
			</div>
        );
    }
}

export default ChatRoomManager;