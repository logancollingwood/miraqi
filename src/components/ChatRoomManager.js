import React from "react";
import Chat from "./Chat";
import io from "socket.io-client";
import Config from "../Config.js";
import DjContainer from "./DjContainer.js";

class ChatRoomManager extends React.Component {

	constructor(props) {
		super(props);
		this.socket = io(Config.SOCKET_API_HOST);
		this.state = {
			messages: [],
			loaded: true,
		}
	

	}

	componentDidMount() {
		this.setState({
			marginTop: this.playerElement.props.height,
			isLoaded: true
		})
	}


    render() {		
        return (
			<div className="container-fluid">
				<div className="row justify-content-center main-content">
					<DjContainer socket={this.socket}/>
					<Chat socket={this.socket} currentRoom={this.props.currentRoom}/>
				</div>
			</div>
        );
    }
}

export default ChatRoomManager;